import React, { useEffect, useState } from 'react';

import { getModalDimensions } from '../../utils/helpers';
import { Image } from '../../info/types';
import { GAEvent } from '../Utils/GA-Tracker';
import '../../styles/templates/mcModal.scss';

import { toggleModalEventName } from '../../utils/constants';

const McModal: React.FunctionComponent = () => {
  const [showModal, toggleModal] = useState(false);
  const [image, setImage] = useState<Image>();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const escapeModal = (event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      if (showModal) {
        toggleModal(false);
        GAEvent('Image', 'Modal', 'Escaped');
      }
    }
  };

  const renderModal = (event: CustomEvent) => {
    const { detail } = event;
    setImage(detail);
    setDimensions(getModalDimensions(detail));
    toggleModal(true);
  };

  useEffect(() => {
    document.addEventListener(
      toggleModalEventName,
      renderModal as EventListener
    );
    document.addEventListener('keyup', escapeModal);
    return () => {
      document.removeEventListener('keyup', escapeModal);
      document.removeEventListener(
        toggleModalEventName,
        renderModal as EventListener
      );
    };
  });

  return showModal ? (
    <div className='mcModal'>
      <div
        className='mcModalContent'
        style={{
          width: dimensions.width + 'px',
          height: dimensions.height + 'px',
        }}
      >
        <div className='mcModalBody'>
          <img src={image!.original} alt={image!.description} tabIndex={0} />
        </div>
      </div>
      <div
        className='close'
        onClick={() => {
          toggleModal(false);
          GAEvent('Image', 'Modal', 'Closed');
        }}
        title='close'
        tabIndex={0}
      ></div>
    </div>
  ) : (
    <></>
  );
};

export default McModal;
