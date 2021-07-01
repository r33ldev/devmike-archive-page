/* eslint-disable no-undef */

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

// Stripe starts
const stripe = Stripe(
  'pk_test_51J7oLsENXx0nYu127WbSGG1qav4s5eY1kszsZk0oyaLob9YlX4roVHnKzCxlFDuoZauistdvQDed6NRKg6bmzI2p00iNIBDk64'
);

const paySub = async (userId) => {
  try {
    const session = await axios(`/premium/checkout-session/${userId}`);
    // Create checkout form and charge card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    showAlert('error', err);
  }
};

// Stripe ends

// SELECTING DOM ELEMENTS
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/login`,
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', 'Incorrect Password or email!');
  }
};

const signup = async (email, username, name, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/create-account',
      data: {
        email,
        username,
        name,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Account created successfully! please check your email'
      );
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.message);
    // console.log(err.message.split(':')[2].split(',')[0]);
  }
};

const updateSettings = async (data, type) => {
  try {
    const url = '/upload-photo';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    // console.log(resp);
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.toUpperCase()} updated successfully! Refresh the page to see changes.`
      );
    }
  } catch (err) {
    console.log(err.response.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/logout',
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again later');
    // console.log(err);
  }
};

const goToHome = async () => {
  try {
    await axios({
      method: 'GET',
      url: '/',
    });
  } catch (err) {
    // if (err.reponse.data.statusCode === 501) return res.redirect('/');
    console.log(err.response.data.message);
  }
};

const btnLogin = document.getElementById('btn-rock');
const btnSignup = document.getElementById('btn-signup');
const btnLogout = document.getElementById('btn-logout');
const btnToggle = document.getElementById('toggle');
const photoBtn = document.getElementById('form-data');
const premiumBtn = document.getElementById('premium');

// Upload user photo
if (photoBtn) {
  document.querySelector('#photoLabel').addEventListener('click', () => {
    document.querySelector('.btn-updatePhoto').style.display = 'inline-block';
  });
  photoBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

// Toggling password visibilty

if (btnToggle) {
  btnToggle.addEventListener('click', () => {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
    } else if (passwordField.type === 'text') {
      passwordField.type = 'password';
    }
  });
}

// Login
if (btnLogin) {
  btnLogin.addEventListener('click', () => {
    btnLogin.textContent = 'Logging in...';
    const email = emailField.value;
    const password = passwordField.value;
    login(email, password);
  });

  // Sign up
} else if (btnSignup) {
  btnSignup.addEventListener('click', () => {
    btnSignup.textContent = 'Creating...';
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordconfirm').value;
    signup(email, username, name, password, passwordConfirm);
  });

  // Log out
} else if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    btnLogout.textContent = 'Loading ....';
    logout();
  });
}

if (premiumBtn)
  premiumBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing....';
    const { userId } = e.target.dataset;
    paySub(userId);
  });
