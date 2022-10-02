import { body, backdropSingIn, btnCloseSingIn, modalSingUpBtn } from './refs';
import { onPressEsk, onClickSingUp, resetForm } from './modalSingUp';
console.log(btnCloseSingIn);
export function toggleModalSingIn() {
  backdropSingIn.classList.toggle('is-hidden');
  body.classList.toggle('noscroll');
  resetForm();
}

function onClickBackdrop(e) {
  if (e.target.classList.contains('backdrop')) {
    toggleModalSingIn();
    backdropSingIn.removeEventListener('click', onClickBackdrop);
  }
}

export function onClickSingInBtn() {
  toggleModalSingIn();
  window.addEventListener('keydown', onPressEsk);
  backdropSingIn.addEventListener('click', onClickBackdrop);
  btnCloseSingIn.addEventListener('click', toggleModalSingIn);
  modalSingUpBtn.addEventListener('click', onSingUp);
}

function onSingUp() {
  toggleModalSingIn();
  onClickSingUp();
  modalSingUpBtn.removeEventListener('click', onSingUp);
}
