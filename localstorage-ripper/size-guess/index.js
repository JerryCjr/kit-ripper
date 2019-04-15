export default function () {
  if (localStorage && !localStorage.getItem('size')) {
    let i = 0;
    let j = 0;
    try {
      // Test up to 10MB characters (not memory);
      for (i = 250; i <= 10000; i += 250) {
        localStorage.setItem('test', new Array((i * 1024) + 1).join('a'));
      }
    } catch (e) {
      try {
        // 细粒度
        for (j = i - 250; j <= 10000; j += 20) {
          localStorage.setItem('test', new Array((j * 1024) + 1).join('a'));
        }
      } catch (e) {
        localStorage.removeItem('test');
        localStorage.setItem('size', j - 20);
      }
    }
  }
}