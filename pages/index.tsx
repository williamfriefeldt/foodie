import Head from 'next/head'
import Script from 'next/script';
import { useEffect, useState } from 'react'
import Map from '../components/map';

export interface Restaurant {
  name:string;
  _id:string;
  title:string;
  text:string;
  images:string;
  coordinates: [number, number]
}

export default function Home() {

  const [restaurants, setRestaurants] = useState<Restaurant[]>();

  useEffect(() => {
    fetch("/api/restaurants")
      .then(res => res.json())
      .then(data => {setRestaurants(data)})
  }, []); 

  const [mapLoaded, setMapLoaded] = useState(false);

  const initMap = () => {
    setMapLoaded(true);
  }

  return (
    <>
      <Head>
        <title>Foodie</title>
        <link rel="icon" href="/pasta-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head> 

      <Map mapLoaded={mapLoaded} restaurants={restaurants} />

      <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}&libraries=&v=weekly`}
          async
          onLoad={initMap}
      />
    </>
  )
}
