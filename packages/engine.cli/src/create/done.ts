type props = {
  isCleanupReady: State["create"]["flags"]["isCleanupReady"];
};

export const done: producer = ({
  isCleanupReady = observe.create.flags.isCleanupReady,
}: props) => {
  if (!isCleanupReady) {
    return;
  }

  console.log(`
Your Engine application is ready.
cd to your folder and run:

yarn start

`);
};
