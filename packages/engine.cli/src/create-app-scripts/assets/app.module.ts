import './reset.css';
import './app.css';

export const bootstrap = async (props) => Promise.resolve().then(() => {
  console.log(`Application bootstrapped!`);
});

export const mount = (props) => Promise.resolve().then(() => {
  console.log(`Application mounted!`);
});

export const unmount = (props) => Promise.resolve().then(() => {
  console.log(`Application unmounted!`)
});
