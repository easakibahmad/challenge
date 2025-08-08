export function getRandomColor(): string {
  const randomInt = Math.floor(Math.random() * 0xffffff);
  const hex = randomInt.toString(16).padStart(6, '0');
  return `#${hex}`;
}

export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 11)
  );
}