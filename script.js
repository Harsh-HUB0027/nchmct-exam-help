// Simple scroll animation
window.addEventListener('scroll', function(){
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if(sectionTop < window.innerHeight - 100){
      section.classList.add('animate');
    }
  });
});
