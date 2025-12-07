interface DynamicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /* add any custom props here if needed */
}

const DynamicImage: React.FC<DynamicImageProps> = (props) => {
    return <img {...props} />;
};

export default DynamicImage;