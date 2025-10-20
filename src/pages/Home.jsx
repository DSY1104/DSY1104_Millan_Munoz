import React, { useEffect, useState } from "react";
import Hero from "/src/components/landing/Hero.jsx";
import WhyBuySection from "../components/landing/WhyBuy";
import CategoriesSection from "../components/landing/CategoriesSection";
import NewsSection from "../components/landing/NewsSection";
import EventsSection from "../components/landing/Events";


export default function HomePage() {
  return (
    <div>
      <div className="content-wrapper" style={{ margin: 0 }}>
        <main>
          <Hero />
          <CategoriesSection />
          <WhyBuySection />
          <NewsSection />
          <EventsSection />
        </main>
      </div>
    </div>
  );
}
