import { AntDesign } from '@expo/vector-icons';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import Layout from '../constants/Layout';
import AddressForm from './AddressForm';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  centeredView: {},
  modalView: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: Layout.window.width,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowRadius: 0,
  },
  optionContainer: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    color: '#333',
  },
  activeOption: {
    borderColor: '#49DA8B',
    backgroundColor: '#dbfff0',
  },
  activeOptionText: {
    color: '#047e4b',
  },
  marginTB: {
    marginTop: 20,
    marginBottom: 10,
  },
});
type AddressValues = {
  street: string;
  streetNumber: string;
  postalCode: string;
  floor?: string;
  apartment?: string;
  provinceId: string;
  cityId: string;
  neighborhoodId: string;
  latitude: string;
  longitude: string;
};
const Location = ({
  title,
  receivedAddress,
  onAddressSet,
  errorAddress,
  torky = false,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [step, setStep] = useState(1);

  const handleModalClose = (values: AddressValues) => {
    if (onAddressSet) onAddressSet(values);
    setShowModal(!showModal);
  };

  const NewScrapSchema = Yup.object().shape({
    address: AddressForm.getValidationSchema(),
  });

  const initialValues = receivedAddress || {
    address: AddressForm.getInitialValues(),
  };

  return (
    <>
      <View style={styles.marginTB}>
        <Button
          type="primary"
          onPress={() => {
            setShowModal(!showModal);
            setStep(1);
          }}
        >
          {title}
        </Button>
      </View>
      {errorAddress && (
        <View style={{ marginTop: 5 }}>
          <ErrorMessage message="La ubiacación es requerida" />
        </View>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
          setStep(1);
        }}
      >
        <View style={styles.modalView}>
          <Formik
            initialValues={initialValues}
            validationSchema={NewScrapSchema}
            onSubmit={(values) => {
              handleModalClose(values);
            }}
          >
            {({ setFieldValue, handleSubmit, values }) => (
              <>
                {Platform.OS === 'ios' ? (
                  <View
                    style={{
                      height: 55,
                      backgroundColor: '#49DA8B',
                    }}
                  ></View>
                ) : null}
                {step === 1 && (
                  <>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 20,
                        paddingBottom: 20,
                        backgroundColor: step === 1 ? '#ecf0f1' : 'white',
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          setShowModal(!showModal);
                          setStep(1);
                        }}
                      >
                        <AntDesign name="close" size={20} color="black" />
                      </Pressable>
                    </View>
                  </>
                )}
                <AddressForm torky={torky} onChangeStep={setStep} />
                {step === 2 && (
                  <View
                    style={[
                      Platform.OS === 'ios' ? { paddingBottom: 20 } : null,
                    ]}
                  >
                    <Button type="secondary" onPress={handleSubmit}>
                      Guardar dirección
                    </Button>
                  </View>
                )}
              </>
            )}
          </Formik>
        </View>
      </Modal>
    </>
  );
};

export default Location;
