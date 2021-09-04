import React from "react";

const AboutMe: React.FunctionComponent = () => {
  return (
    <section className="aboutme">
      <section>
        <div className="intro sub-section">
          <span className="title">About me</span>
          <span>
            Hello I'm Sai Vamsi ,I'm from andhra pradesh india.I'm a Graduate
            Once later on followed my passion & PG diploma In Photography to get
            into professional level of Photography . Mentored by great teachers
            . I'm specilised In travel photography but i will do product ,
            commerical , jewellery ,weddings & events , Night sky lover soo I
            will do milky wayp chasings too , I always want to Create somethings
            that never last ,photography is a part of me
          </span>
        </div>
        <div className="profile">
          <span className="picture" />
          <span className="name">Moment Capturer</span>
          <div className="social">
            <a
              href="https://wa.me/919393633334"
              target="_blank"
              rel="noopener noreferrer"
              title="Whatsapp"
            >
              <span className="whatsapp"></span>
            </a>
            <a
              href="https://www.instagram.com/i_am_the_moment_capturer/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <span className="instagram"></span>
            </a>
            <a
              href="https://www.facebook.com/momentcapturer77"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <span className="facebook"></span>
            </a>
          </div>
        </div>
      </section>
      <section className="sub-section">
        <span>Top recognitions</span>
        <ul>
          <li>Published in various instagram travel photography pages.</li>
          <li>
            Published in Photographerwithoutborders magzine in the top
            instagrammer hastag.
          </li>
        </ul>
        <span></span>
      </section>
      <section className="sub-section">
        <span>Top skills</span>
        <ul>
          <li>Can organize wedding events</li>
          <li>Can conduct workshops on Astro photography</li>
          <li>Can Be a Mentor in Photography and Share my knowledge</li>
          <li>Can be a interior & archittecture Photography</li>
          <li>Fashion and Product both for commercial & editorial</li>
          <li>
            Depth in adjusting lighting according to the mood & Requirment
          </li>
          <li>
            Fashion photography and well knowledged in various lighting set up
            based on the mood that we want to create
          </li>
          <li>Good Depth in Colour Theory</li>
        </ul>
      </section>
      <section className="sub-section">
        <span>Experience</span>
        <ul>
          <li>Started as Ethusiactic & did Wedding Photography For 1 year</li>
          <li>
            Took up Course In Photography and Graduated in 2018/19 with thesis
            in Travel Photography
          </li>
          <li>
            Joined as Product Photographer ( jewellry ) for Anjeneya jewellery,
            vijayawada & Natraj Jewellery ,Tenalo
          </li>
          <li>Established "Moment Capturer"</li>
        </ul>
      </section>
    </section>
  );
};

export default AboutMe;
