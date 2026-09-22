export function required(value) {
  return Boolean(String(value ?? '').trim());
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateGig(values) {
  return {
    title: required(values.title) ? '' : 'Title is required',
    category: required(values.category) ? '' : 'Category is required',
    price: Number(values.price) > 0 ? '' : 'Enter a valid price',
  };
}
