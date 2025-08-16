import * as React from 'react';

import CartonImg from '../assets/images/cat/svg/carton.svg';
import PlasticoImg from '../assets/images/cat/svg/plastico.svg';
import MetalImg from '../assets/images/cat/svg/metal.svg';
import CablesImg from '../assets/images/cat/svg/cables.svg';
import MaquinariaImg from '../assets/images/cat/svg/electronico.svg';
import MaderaImg from '../assets/images/cat/svg/madera.svg';
import ElectronicosImg from '../assets/images/cat/svg/maquinaria.svg';
import TextilImg from '../assets/images/cat/svg/textil.svg';
import MuebleImg from '../assets/images/cat/svg/mueble.svg';
import PapelImg from '../assets/images/cat/svg/papel.svg';

type CategoryItemProps = {
  value: unknown;
  style: any;
};

function CategoryImage({ value, style }: CategoryItemProps) {
  const icons = {
    1: <MetalImg />,
    2: <CartonImg />,
    3: <MaderaImg />,
    4: <PlasticoImg />,
    5: <TextilImg />,
    6: <MuebleImg />,
    7: <ElectronicosImg />,
    8: <MaquinariaImg />,
    9: <PapelImg />,
    10: <CablesImg />,
  };

  return <>{icons[value]}</>;
}

CategoryImage.defaultProps = {
  size: 60,
};

export default CategoryImage;
