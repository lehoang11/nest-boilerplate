import Decimal from 'decimal.js'

export function add(a: string, b: string): string { return new Decimal(a || '0').add(new Decimal(b || '0')).toString() }
export function sub(a: string, b: string): string { return new Decimal(a || '0').sub(new Decimal(b || '0')).toString() }
export function mul(a: string, b: string): string { return new Decimal(a || '0').mul(new Decimal(b || '0')).toString() }
export function div(a: string, b: string): string { return new Decimal(a || '0').div(new Decimal(b || '0')).toString() }
export function gt(a: string, b: string): boolean { return new Decimal(a || '0').gt(new Decimal(b || '0')) }
export function gte(a: string, b: string): boolean { return new Decimal(a || '0').gte(new Decimal(b || '0')) }
export function lt(a: string, b: string): boolean { return new Decimal(a || '0').lt(new Decimal(b || '0')) }
export function lte(a: string, b: string): boolean { return new Decimal(a || '0').lte(new Decimal(b || '0')) }
export function eq(a: string, b: string): boolean { return new Decimal(a || '0').eq(new Decimal(b || '0')) }
