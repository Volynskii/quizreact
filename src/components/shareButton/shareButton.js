import React, { useEffect } from 'react';

const ShareButton = ({ socialMediaItem, url, title, description, image, index }) => {

    useEffect(() => {
        // Инициализация кнопок Yandex Share после рендеринга компонента
        window.Ya && window.Ya.share2 && window.Ya.share2(document.getElementById(`yandex-share-${index}`));
    }, [index]);

    return (
        <div
            id={`yandex-share-${index}`} // Use unique ID for each button
            className="ya-share2"
            data-curtain
            data-size="s"
            data-services={socialMediaItem}
            data-title={title}
            data-url={url}
            data-description={description}
            data-image={image}
        ></div>
    );
};

export default ShareButton;
