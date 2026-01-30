
/// <reference types="vite/client" />

const modules = import.meta.glob('./*.webp', {
  eager: true,
});

export const timelineImages: Record<string, string> = {};

for (const path in modules) {
  const mod = modules[path] as { default: string };
  const fileName = path.split('/').pop()!;
  timelineImages[fileName] = mod.default;
}
