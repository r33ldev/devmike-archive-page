/* eslint-disable no-undef */
const stripe = Stripe(
  'pk_test_51J7oLsENXx0nYu127WbSGG1qav4s5eY1kszsZk0oyaLob9YlX4roVHnKzCxlFDuoZauistdvQDed6NRKg6bmzI2p00iNIBDk64'
);
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

const paySub = async (userId) => {
  try {
    const session = await axios(`/premium/checkout-session/${userId}`);
    // console.log(session);

    // Create checkout form and charge card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    showAlert('error', err);
  }
};

module.export = paySub;
