import React from 'react';
import ShareButton from '../shareButton/shareButton';

const SocialMedia = ({ url, title, description, image, socialMedia }) => {

    return (
        <div className={'vgtrk-widget-quiz__share'}>
            {socialMedia.map((socialMediaItem, index) => (
                <ShareButton
                    key={index}
                    socialMediaItem={socialMediaItem}
                    url={url}
                    title={title}
                    description={description}
                    image={image}
                    index={index} // Pass index to create unique IDs
                />
            ))}
        </div>
    );
};

export default SocialMedia;
