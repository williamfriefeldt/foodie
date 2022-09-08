import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FileInput } from "../components/styled/file-input";
import { Input } from "../components/styled/input";
import { Label } from "../components/styled/label";
import { Textarea } from "../components/styled/textarea";
import styles from '../styles/post.module.scss';
import { RiImageAddFill } from 'react-icons/ri';
import { FileImg } from "../components/styled/file-img";
import { Button } from "../components/styled/button";
import Script from "next/script";

interface Inputs {
    name: string;
    title: string;
    text: string;
    files: File[];
    coordinates: number[];
}

export default function Post() {

    const restaurantInput = useRef<HTMLInputElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    const [inputs, setInputs] = useState<Inputs>({
        name: '',
        title: '',
        text: '',
        files: [],
        coordinates: []
    });

    const setInput = ({ target }:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(inputs => ({
            ...inputs,
            [target.name]: target.value
        }))
    }

    useEffect(() => {
        restaurantInput.current?.focus();
    }, []);


    const fileChanged = ({target}:ChangeEvent<HTMLInputElement>) => {
        if(target.files) {
            const files = Array.from(target.files);
            setInputs(inputs => ({
                ...inputs,
                files: [...inputs.files, files[0]]
            }));
        }
    }

    const getImgUrl = (file:File) => URL.createObjectURL(file);

    const inputsReady = () => Object.values(inputs).every( value => value.length != 0);


    const savePost = async () => {
        const imagesBase64 = await Promise.all(
            inputs.files.map(file => new Promise((result, _rej) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = _result => result(_result.target?.result)
            }))
        )
        
        fetch('/api/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: inputs.name,
                title: inputs.title,
                text: inputs.text,
                images: imagesBase64,
                coordinates: inputs.coordinates
            })
            }).then(res => res.json())
              .then(data => console.log(data))
    }

    const markerRef = useRef<google.maps.Marker>();

    const initMap = () => {
        const mapElement = document.getElementById("map");
        if(mapElement) {
            const map =new google.maps.Map(mapElement, {
                center: {      
                    lat:59.334591, lng:18.063240
                },
                mapTypeControl: false,
                streetViewControl: false,
                zoom: 13, 
                gestureHandling: 'greedy',
                styles: [{
                    featureType: "poi",
                    stylers: [{ visibility: "off" }],
                },{
                    featureType: "road",
                    elementType: "labels.icon",
                   stylers: [{ "visibility": "off" }]
                },],
            })

            google.maps.event.addListener(map, 'click', ({ latLng } : { latLng: google.maps.LatLng}) => {
                if(markerRef.current) {
                    markerRef.current.setMap(null);
                }

                markerRef.current = new google.maps.Marker({
                    position: latLng,
                    map
                });

                setInputs( state => ({ ...state, coordinates:[latLng.lat(), latLng.lng()]}));
            });
        }
    }

    return (
        <div className="container">
            <Label>Restaurang</Label>
            <Input ref={restaurantInput} placeholder="Namnet på restaurangen"  name="name" onChange={setInput}/>

            <Label>Titel</Label>
            <div className={styles["label-text"]}>(på inlägget)</div>
            <Input placeholder="Titel på besöket" name="title" onChange={setInput}/>

            <Label>Inlägg</Label>
            <Textarea rows={7} placeholder="Text om besöket" name="text" onChange={setInput}/>

            <Label>Bilder</Label>
            <div className={styles["images-container"]}>
                {inputs.files.map(file =><FileImg key={file.name} src={getImgUrl(file)} />)}

                <FileInput onClick={() => { fileInput.current?.click() }}><RiImageAddFill  size={90}/></FileInput>
                <input type="file" className={styles["file-input"]} ref={fileInput} onChange={fileChanged}  accept="image/png, image/gif, image/jpeg" />      
            </div>

            <Label>Markera var restaurangen ligger</Label>
            <div id="map" className={styles.map} />
                        
            <Button disabled={!inputsReady()} onClick={savePost}>Dela inlägg</Button>

            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}&libraries=&v=weekly`}
                async
                onLoad={initMap}
            />
        </div>
    )
}