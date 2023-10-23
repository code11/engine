import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import ChevronRight from "@site/static/img/chevron-right.svg";
import Producer from "@site/static/img/producer.svg";
import State from "@site/static/img/state.svg";
import Views from "@site/static/img/views.svg";
import ArrowDown from "@site/static/img/arrow-down.svg";
import ArrowUp from "@site/static/img/arrow-up.svg";
import ViewsCard from "@site/static/img/views-card.svg";
import MobileArrows from "@site/static/img/mobile-arrows.svg";

const features = [
  {
    imageUrl: "/img/product-focused.svg",
    title: <>Product focused</>,
    description: (
      <>
        Thanks to a minimal API you will write less code and get away from
        boilerplate to focus on the actual product
      </>
    ),
    buttonUrl: "/engine/docs/#goals"
  },
  {
    imageUrl: "/img/reduced-complexity.svg",
    title: <>Reduced complexity</>,
    description: (
      <>
        States and transformations are independent which keeps the project
        complexity from growing exponentially over time
      </>
    ),
    buttonUrl: "/engine/docs/concepts/state"
  },
  {
    imageUrl: "/img/development-tools.svg",
    title: <>Development tools</>,
    description: (
      <>
        The Engine Dashboard provides a realtime x-ray of your application so
        you always know what goes on in there
      </>
    ),
    buttonUrl: "/engine/docs/packages/dashboard/"
  },
];

function Feature({ imageUrl, title, description, buttonUrl }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <>
      <div className={styles.feature}>
        {imgUrl && (
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        )}
        <h3>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
        <Link className={clsx("button button--outline", styles.featureButton)}
          to={useBaseUrl(buttonUrl)}
        >
          Find out more
        </Link>
      </div>
      <span className={styles.separator}></span>
    </>
  );
}

function ActionsPreview() {
  return (
    <>
      <div className={clsx("card", styles.actionsPreviewCard)}>
        <div className={clsx("card__body", styles.cardBodyHero)}>
          <div className={styles.arrowContainer}>
            <div className={styles.manipulateUp}>
              <ArrowDown />
            </div>
            <div className={styles.drivesUp}>
              <ArrowDown />
            </div>
          </div>
          <div className={styles.actionsPreview}>
            <div className={styles.actionType + " " + styles.producers}>
              <h2>Producers</h2>
              <p>
                Consume data and send changes <br /> to the state according to
                business logic
              </p>
              <div className={clsx("card", styles.presentationCard)}>
                <Producer />
              </div>
            </div>
            <div className={styles.actionType + " " + styles.state}>
              <h2>State</h2>
              <p>
                The single source of truth <br /> for the application
              </p>
              <div className={clsx("card", styles.presentationCard)}>
                <State />
              </div>
            </div>
            <div className={styles.actionType + " " + styles.view}>
              <h2>Views</h2>
              <p>
                Visualize data and update the state <br /> based on user
                intention
              </p>
              <div className={clsx("card", styles.presentationCard)}>
                <Views />
              </div>
            </div>
          </div>
          <div className={styles.arrowContainer}>
            <div className={styles.manipulateDown}>
              <ArrowUp />
            </div>
            <div className={styles.drivesDown}>
              <ArrowUp />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mobileCarouselWrapper}>
        <div className={styles.mobileCarouselWrapperInner}>
          <div className={styles.slider}>
            <div className={styles.mobileCard}>
              <h2>Producers</h2>
              <p>
                Consume data and send changes <br /> to the state according to
                business logic
              </p>
              <div>
                <Producer />
              </div>
            </div>
            <span className={styles.mobileArrows + " " + styles.manipulate}>
              <MobileArrows />
            </span>
            <div className={styles.mobileCard}>
              <h2>State</h2>
              <p>
                The single source of truth <br /> for the application
              </p>
              <div>
                <State />
              </div>
            </div>
            <span className={styles.mobileArrows + " " + styles.drives}>
              <MobileArrows />
            </span>
            <div className={styles.mobileCard}>
              <h2>Views</h2>
              <p>
                Visualize data and update the state <br /> based on user
                intention
              </p>
              <div>
                <ViewsCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className={clsx("container", styles.heroContainer)}>
          <div className={styles.heroDescription}>
            {/* <h1 className="hero__title">{siteConfig.title}</h1> */}
            {/* <p className="hero__subtitle">{siteConfig.tagline}</p> */}
            <h1 className="hero__title">
              <span>Code11</span>ENGINE
            </h1>
            <p>
              A{" "}
              <span className={styles.heroUnderline}>
                Javascript language extension{" "}
              </span>
              to simplify web-app development using:
            </p>
            <ul>
              <li>
                <p>
                  3 magic words to interface with the state:{" "}
                  <span
                    className={styles.heroTag + " " + styles.getTag}
                    tooltip-align="top"
                    data-tooltip={""}
                  >
                    get
                  </span>
                  <span
                    className={styles.heroTag + " " + styles.observeTag}
                    data-tooltip={""}
                  >
                    observe
                  </span>
                  <span
                    className={styles.heroTag + " " + styles.updateTag}
                    data-tooltip={""}
                  >
                    update
                  </span>
                </p>
              </li>
              <li>
                <p>
                  a way to manipulate data according to business logic:{" "}
                  <span
                    className={styles.heroTag + " " + styles.producersTag}
                    data-tooltip={""}
                  >
                    producers
                  </span>
                </p>
              </li>
              <li>
                <p>a React-powered rendering engine</p>
              </li>
            </ul>
          </div>
          <div className={styles.heroButtons}>
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              {" "}
              Get Started
            </Link>
            <Link
              className={clsx(
                "button button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              {" "}
              Documentation
            </Link>
          </div>
        </div>
      </header>
      <ActionsPreview />
      <main className={styles.mainContent}>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className={styles.featuresRow}>
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
