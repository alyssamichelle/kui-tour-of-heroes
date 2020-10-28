// export const numberOnly: string = '^[0-9]*$';
export const numberOnly: RegExp = new RegExp(/^[0-9]*$/);

export const phoneUS: RegExp = new RegExp(/^\s?1?\s?(\(\d{3}\)|\d{3})\-?\s?\d{3}\-?\s?\d{4}$/);

export const phoneUK: RegExp = new RegExp(/^[0](\d{10})$/);