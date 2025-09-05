// Swiper init
var swiper = new Swiper('.swiper-container', {
  loop:true, autoplay:{delay:2000}, pagination:{el:'.swiper-pagination'}
});

// Notices load
fetch('notices.json').then(r=>r.json()).then(data=>{
  const box=document.getElementById('noticeBox');
  box.textContent = data.notices.join(' | ');
  document.getElementById('ticker').textContent = data.notices.join('   •   ');
});

// Tab switch
function showTab(id){
  document.querySelectorAll('.college-tab').forEach(tab=>tab.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// Contact form
document.getElementById('contactForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const name=document.getElementById('name').value;
  const email=document.getElementById('email').value;
  const msg=document.getElementById('message').value;
  const text=`New message from ${name} (${email}): ${msg}`;
  // Telegram send
  fetch(`https://api.telegram.org/bot<8195788544:AAHXxVGqRw8u4yPxY9txKq1cgofFmEoKHLU>/sendMessage`,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:'<5814722092>',text})
  });
  alert('Message sent!');
});
