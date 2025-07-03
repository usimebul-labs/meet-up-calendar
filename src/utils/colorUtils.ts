const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B801', '#5F4B8B',
  '#E67E22', '#2ECC71', '#3498DB', '#9B59B6', '#1ABC9C'
];

// 간단한 해시 함수: 문자열을 숫자로 변환
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash);
}

export function getUserColor(userId: string): string {
  const hash = simpleHash(userId);
  const index = hash % COLORS.length;
  return COLORS[index];
}
