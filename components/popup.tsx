import { Restaurant } from '../pages';
import styles from '../styles/popup.module.scss';

interface PopupProps {
    animated?: boolean;
    position: [number, number];
    restaurant?: Restaurant
}

export default function Popup({animated, position, restaurant}:PopupProps) {

    return (
        <div className={`${styles.container} ${animated && styles.scaled}`} style={{
            top: position[0] - 150, 
            left: position[1] - 150,
            backgroundImage: 'url(' + restaurant?.images[0] + ')'
        }}>
            {restaurant && restaurant.name}
        </div>
    )
}