import { Restaurant } from '../pages';
import styles from '../styles/popup.module.scss';
import { Button } from './styled/button';

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
            <div className={styles.content}>
                {restaurant && (
                    <>
                        <div className={styles.name}>{restaurant.name}</div>
                        <div className={styles.title}>"{restaurant.title}"</div>
                        <div className={styles.text}>
                            {restaurant.text}
                        </div>
                    </>
                )}
            </div>
            <Button className={styles.button}>Mera!🤤</Button>
        </div>
    ) 
} 