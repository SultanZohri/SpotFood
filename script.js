
const tombolPesan = document.querySelectorAll('.menu-item button');

tombolPesan.forEach(button => {
  button.addEventListener('click', () => {
    const namaMenu = button.parentElement.querySelector('h3').textContent;
    alert(`🍽️ Kamu memesan: ${namaMenu}\nTerima kasih sudah berbelanja di SpotFood! 😋`);
  });
});
