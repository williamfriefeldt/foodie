import { useEffect, useRef, useState } from 'react';
import { Restaurant } from '../pages';
import styles from '../styles/map.module.scss';
import { options } from './map-options';
import Popup from './popup';

interface MapProps {
    mapLoaded: boolean
    restaurants?: Restaurant[]
}

interface CurrentRestaurant {
    marker?: google.maps.Marker;
    restaurant?: Restaurant;
    animated?: boolean;
}

const getNewPopupPosition = (map:google.maps.Map, marker:google.maps.Marker) : [number, number] => {
    const scale = Math.pow(2, map.getZoom()!)
    const nw = new google.maps.LatLng(
        map.getBounds()?.getNorthEast().lat()!,
        map.getBounds()?.getSouthWest().lng()
    );
    const worldCoordinateNW = map.getProjection()?.fromLatLngToPoint(nw)
    const worldCoordinate = map.getProjection()?.fromLatLngToPoint(marker.getPosition()!)
    const position = new google.maps.Point(
        Math.floor((worldCoordinate!.x - worldCoordinateNW!.x) * scale),
        Math.floor((worldCoordinate!.y - worldCoordinateNW!.y) * scale))
    
    return  [position.y, position.x]
}

export default function Map(props:MapProps) { 

    const [map, setMap] = useState<google.maps.Map>()
    const [zoom, setZoom] = useState(options.zoom! + 1)
    const zoomComplete = useRef(false)
    const [animationReady, setAnimationReady] = useState(false)

    const [popupPos, setPopupPos] = useState<[number, number]>([0,0])
    const [currentRestaurant, setCurrentRestaurant] = useState<CurrentRestaurant>()

    useEffect(() => {
        const mapElement = document.getElementById("map");
        if(mapElement && props.mapLoaded) {
           setMap(new google.maps.Map(mapElement, options));
        }
    }, [props.mapLoaded]);

    useEffect(() => {
        if(!zoomComplete.current && map && animationReady) {
            const interval = setInterval(() => {
                map.setZoom(zoom);
                setZoom(state => state + 0.25)
            }, 50)
            return () => clearInterval(interval)
        }
    }, [map, zoom, animationReady])
    
    if(zoom === 13) {
        zoomComplete.current = true
    } 

    if(!animationReady) {
        setTimeout(() => {
            setAnimationReady(true)
        }, 350)
    }

    useEffect(() => {
        if(props.restaurants && map) {
            props.restaurants.forEach(restaurant => {
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(restaurant.coordinates[0], restaurant.coordinates[1]),
                    map,
                    icon: { url: '/pasta-icon.png', scaledSize: new google.maps.Size(35, 35) }, 
                });
                google.maps.event.addListener(marker, 'click', () => {
                    if(currentRestaurant?.marker && currentRestaurant?.animated) {
                        setCurrentRestaurant(state => ({
                            ...state, animated: false
                        }))
                        setTimeout(() => {
                            setCurrentRestaurant({
                                restaurant: restaurant,
                                marker: marker,
                            })
                            setPopupPos(getNewPopupPosition(map, marker))
                        }, 250);
                    } else {
                        setCurrentRestaurant({
                            restaurant: restaurant,
                            marker: marker,
                        })
                        setPopupPos(getNewPopupPosition(map, marker))
                    }  
                })
                return marker;
            });
            
            map.addListener('bounds_changed', () => {
                if(currentRestaurant?.marker) {
                    setPopupPos(getNewPopupPosition(map, currentRestaurant.marker))
                }
            })

            map.addListener('click', () => {
                if(currentRestaurant?.marker) {
                    setCurrentRestaurant(state => ({
                        ...state, animated: false
                    }))
                    setTimeout(() => {
                        setCurrentRestaurant({marker: undefined, animated: undefined})    
                    }, 500);
                }
            })
        }
    }, [props.restaurants, map, currentRestaurant]);

    useEffect(() => {
        if(currentRestaurant?.marker && currentRestaurant.animated === undefined) {
            setCurrentRestaurant(state => ({...state, animated: true}))
        } 
    }, [currentRestaurant])

    return (
        <>
            <div id="map" className={styles.map} />

            {currentRestaurant?.marker && 
                <Popup animated={currentRestaurant.animated} position={popupPos} restaurant={currentRestaurant.restaurant} />
            }
        </>
    )
}