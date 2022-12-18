
const next = document.querySelector('.form__next-step');
const prev = document.querySelector('.form__prev-step');

next.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('step-1').classList.remove('active');
	document.getElementById('step-2').classList.add('active');	
});

prev.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('step-2').classList.remove('active');
	document.getElementById('step-1').classList.add('active');	
});