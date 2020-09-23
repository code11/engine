import React from 'react'
// import { view, Observe } from "@c11/engine.macro"
import Styles from './style.css'
// import Spinner from '@verified/components.spinner'

// const Baz = ({
//   name
// }: { name: string }) => <div className={Styles.bar}>{name}<Spinner /></div>

const Baz = ({
  name
}: { name: string }) => <div className={Styles.bar}>{name}</div>

interface Bar {
  foo: string;
}

class Foo implements Bar {
  foo = '123';
  constructor() {}
  bam() {
    console.log('a')
  }
}

export const bootstrap = async (props) => Promise.resolve().then(() => {
  console.log(`Application bootstrapped!`);
});

export const mount = (props) => Promise.resolve().then(() => {
  console.log(`Application mounted!`);
});

export const unmount = (props) => Promise.resolve().then(() => {
  console.log(`Application unmounted!`)
});
