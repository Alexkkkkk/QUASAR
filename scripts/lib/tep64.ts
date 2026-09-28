// TEP-64 token metadata.
// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
//
// The standard defines exactly three layouts, selected by the first byte of the
// jetton content cell:
//
//   layout        prefix   payload
//   off-chain     0x01     ASCII URI of the JSON document with the metadata
//   on-chain      0x00     key/value dictionary, key = sha256(attribute name)
//   semi-chain    0x00     same dictionary, plus a mandatory `uri` key whose
//                          value points at the off-chain JSON document
//
// Dictionary values are strings in *snake* format: a cell carries the first
// chunk and the remainder is chained through the first child cell, recursively
// (`SnakeData ~n`).
//
// Deploys, tests and tooling share this one implementation instead of hand
// rolling cells, so a layout mistake fails in CI rather than on-chain.

import { beginCell, Cell, Dictionary, Slice } from '@ton/core';
import { createHash } from 'node:crypto';

export const CONTENT_OFFCHAIN_PREFIX = 0x01;
export const CONTENT_ONCHAIN_PREFIX = 0x00;

/** Bytes one snake cell carries: 127 * 8 = 1016 bits, under the 1023-bit cell limit. */
const SNAKE_CHUNK_BYTES = 127;

/** Attributes this project knows about, used to decode dictionary keys. */
export const KNOWN_FIELDS = ['name', 'symbol', 'decimals', 'image', 'description', 'uri', 'image_data'] as const;
export type MetadataField = (typeof KNOWN_FIELDS)[number];

export type ContentLayout = 'offchain' | 'onchain' | 'unknown';

export interface JettonMetadata {
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    description?: string;
}

/**
 * Dictionary key for an attribute name: sha256 of the UTF-8 name, read as a
 * 256-bit unsigned integer exactly as TEP-64 specifies.
 */
export function fieldKeyHash(field: string): bigint {
    return BigInt('0x' + createHash('sha256').update(field, 'utf8').digest('hex'));
}

/** Recovers an attribute name from its dictionary key, or null if unknown. */
export function reverseFieldKey(key: bigint): string | null {
    for (const field of KNOWN_FIELDS) {
        if (fieldKeyHash(field) === key) return field;
    }
    return null;
}

/** Reads the bits of a slice into a UTF-8 string (snake chunk payload). */
function sliceToString(slice: Slice): string {
    const whole = Math.floor(slice.remainingBits / 8);
    if (whole > 0) return slice.loadBuffer(whole).toString('utf8');
    return '';
}

/** Encodes a string as a TEP-64 snake cell (a single cell when it fits). */
export function toSnakeCell(value: string): Cell {
    const buf = Buffer.from(value, 'utf8');
    if (buf.length === 0) return beginCell().endCell();

    // Cells are filled with whole bytes, so chunk on byte boundaries: 127 bytes
    // is 1016 bits, safely inside the 1023 bits a cell can carry.
    const chunks: Buffer[] = [];
    for (let i = 0; i < buf.length; i += SNAKE_CHUNK_BYTES) {
        chunks.push(buf.subarray(i, i + SNAKE_CHUNK_BYTES));
    }

    // Chain them so each cell references the next: head -> chunk1 -> chunk2 ...
    let acc: Cell | null = null;
    for (let i = chunks.length - 1; i >= 0; i -= 1) {
        const b = beginCell().storeBuffer(chunks[i]);
        if (acc !== null) b.storeRef(acc);
        acc = b.endCell();
    }
    return acc as Cell;
}

/** Decodes a snake cell back into a string. */
export function fromSnakeCell(cell: Cell): string {
    const parts: string[] = [];
    let current: Cell | null = cell;
    for (let guard = 0; current !== null && guard < 64; guard += 1) {
        const s = current.beginParse();
        parts.push(sliceToString(s));
        current = s.remainingRefs > 0 ? s.loadRef() : null;
    }
    return parts.join('');
}

/** Off-chain layout: `0x01` ++ ASCII URI pointing at the metadata JSON. */
export function buildOffchainContent(uri: string): Cell {
    if (uri.length === 0) throw new Error('off-chain content requires a non-empty URI');
    return beginCell().storeUint(CONTENT_OFFCHAIN_PREFIX, 8).storeStringTail(uri).endCell();
}

function buildOnchainDict(fields: Record<string, string | number>): Dictionary<bigint, Cell> {
    const dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
    for (const name of Object.keys(fields)) {
        const value = String(fields[name]);
        if (value.length === 0) throw new Error(`TEP-64 attribute "${name}" must not be empty`);
        dict.set(fieldKeyHash(name), toSnakeCell(value));
    }
    return dict;
}

/** On-chain layout: `0x00` ++ dictionary of sha256(attribute) -> snake value. */
export function buildOnchainContent(fields: Record<string, string | number>): Cell {
    if (Object.keys(fields).length === 0) {
        throw new Error('on-chain content requires at least one attribute');
    }
    const dict = buildOnchainDict(fields);
    return beginCell().storeUint(CONTENT_ONCHAIN_PREFIX, 8).storeDictDirect(dict).endCell();
}

/**
 * Semi-chain layout: an on-chain dictionary that MUST contain the `uri` key, so
 * clients merge the on-chain attributes with the off-chain JSON document and
 * let the on-chain values win on collision.
 */
export function buildSemiChainContent(fields: Record<string, string | number>, uri: string): Cell {
    if (uri.length === 0) throw new Error('semi-chain content requires a non-empty uri');
    const dict = buildOnchainDict({ ...fields, uri });
    return beginCell().storeUint(CONTENT_ONCHAIN_PREFIX, 8).storeDictDirect(dict).endCell();
}

/** Detects the TEP-64 layout of a content cell from its first byte. */
export function contentLayout(content: Cell): ContentLayout {
    const s = content.beginParse();
    if (s.remainingBits < 8) return 'unknown';
    const prefix = s.loadUint(8);
    if (prefix === CONTENT_OFFCHAIN_PREFIX) return 'offchain';
    if (prefix === CONTENT_ONCHAIN_PREFIX) return 'onchain';
    return 'unknown';
}

/** Parses any TEP-64 content cell into its layout, URI and attributes. */
export function parseContent(content: Cell): {
    layout: ContentLayout;
    uri?: string;
    fields?: Record<string, string>;
} {
    const s = content.beginParse();
    if (s.remainingBits < 8) return { layout: 'unknown' };
    const prefix = s.loadUint(8);

    if (prefix === CONTENT_OFFCHAIN_PREFIX) {
        return { layout: 'offchain', uri: sliceToString(s) };
    }
    if (prefix !== CONTENT_ONCHAIN_PREFIX) {
        return { layout: 'unknown' };
    }

    // "The first byte is 0x00 and the rest is a key/value dictionary", so the
    // dictionary starts right after the prefix byte, inline in the same cell.
    const dict = s.loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
    const fields: Record<string, string> = {};
    for (const [key, value] of dict) {
        const name = reverseFieldKey(key);
        if (name !== null) fields[name] = fromSnakeCell(value);
    }
    return { layout: 'onchain', fields };
}

/** Asserts that every attribute the metadata resolver needs is present. */
export function assertRequiredFields(fields: Record<string, string>): void {
    for (const field of ['name', 'symbol', 'decimals', 'image'] as const) {
        const value = fields[field];
        if (value === undefined || value.length === 0) {
            throw new Error(`TEP-64 metadata is missing the required attribute "${field}"`);
        }
    }
}

/**
 * The `decimals` attribute must agree with the 10**decimals multiplier used when
 * minting, otherwise every displayed balance is off by a power of ten.
 */
export function assertDecimalsConsistent(metadata: Record<string, string>, multiplierExponent: number): void {
    const raw = metadata.decimals;
    if (raw === undefined) throw new Error('TEP-64 metadata is missing the required attribute "decimals"');
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 18) {
        throw new Error(`TEP-64 "decimals" must be an integer between 0 and 18, got "${raw}"`);
    }
    if (parsed !== multiplierExponent) {
        throw new Error(
            `TEP-64 "decimals" (${parsed}) disagrees with the mint multiplier 10**${multiplierExponent}`
        );
    }
}
