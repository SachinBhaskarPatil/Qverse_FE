const ImageCard = ({ imageUrl, altText }) => {
  const customStyles = {
    borderRadius: '4px',
    background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
    boxShadow: 'inset 0px 0px 28px 0px rgba(100, 199, 190, 0.50)',
  };

  return (
    <div
    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-lg overflow-hidden shadow-lg"
    style={customStyles}
  >
      <img 
        src={imageUrl} 
        alt={altText} 
        className="w-full h-full object-cover"
        style={{ display: 'none' }} // Hide img since background is set
      />
    </div>
  );
};



export default ImageCard;
