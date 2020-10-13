import './reset.css';
import './app.css';

export const bootstrap = async () => Promise.resolve().then(() => {
  console.log(`Application bootstrapped!`);
});

export const mount = () => Promise.resolve().then(() => {
  console.log(`Application mounted!`);
});

export const unmount = () => Promise.resolve().then(() => {
  console.log(`Application unmounted!`)
});
