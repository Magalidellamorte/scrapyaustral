import get from 'lodash/get';
import React from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { FontAwesome } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import useCategoryList from '../services/useCategoryList';
import useConditionList from '../services/useConditionList';
import useOfferStatuses from '../services/useOfferStatuses';
import useOfferTypeList from '../services/useOfferTypeList';
import Button from './Button';
import CategoryItem from './CategoryItem';
import Slider from './Slider';
import Spacer from './Spacer';

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  fixedButton: {
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    borderRadius: 0,
  },
  buttonFilter: {
    backgroundColor: '#fff',
  },
  modal: {
    backgroundColor: 'red',
  },
  modalView: {
    width: '100%',
    margin: 0,
    borderRadius: 0,
    height: 'auto',
    paddingTop: 30,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
});

const emptyFilters = {
  conditions: [],
  categories: [],
  offerTypes: [],
  offerStatuses: [],
  range: 100,
};

const mapper = ({ name, id }) => ({
  label: name,
  value: id,
});

const Filters = ({
  filters: receivedFilters,
  onRefresh,
  onFiltersSet,
  toShow = [],
}) => {
  const [filters, setFilters] = React.useState(receivedFilters || emptyFilters);

  const [showFilters, setShowFilters] = React.useState(false);

  const conditionsQuery = useConditionList();
  const offerTypesQuery = useOfferTypeList();
  const categoriesQuery = useCategoryList();
  const offerStatusesQuery = useOfferStatuses();

  const offertTypeOptions = get(offerTypesQuery, 'data.data', []).map(mapper);

  const categoriesOptions = get(categoriesQuery, 'data.data', []).map(mapper);

  const conditionOptions = get(conditionsQuery, 'data.data', []).map(mapper);

  const offerStatusesOptions = get(offerStatusesQuery, 'data.data', []).map(
    mapper
  );

  const mappingType = {
    Donar: 'Donación',
    Vender: 'Venta',
  };

  const handlePressedOfferStatuses = React.useCallback(
    (value: number) => () => {
      const selected = filters.offerStatuses.includes(value);

      if (selected) {
        setFilters({
          ...filters,
          offerStatuses: filters.offerStatuses.filter(
            (item: any) => item !== value
          ),
        });
      } else {
        setFilters({
          ...filters,
          offerStatuses: [...filters.offerStatuses, value],
        });
      }
    },
    [filters]
  );

  const handlePressedConditions = React.useCallback(
    (value: number) => () => {
      const selected = filters.conditions.includes(value);

      if (selected) {
        setFilters({
          ...filters,
          conditions: filters.conditions.filter((item: any) => item !== value),
        });
      } else {
        setFilters({
          ...filters,
          conditions: [...filters.conditions, value],
        });
      }
    },
    [filters]
  );

  const handlePressedOfferTypes = React.useCallback(
    (value: number) => () => {
      const selected = filters.offerTypes.includes(value);

      if (selected) {
        setFilters({
          ...filters,
          offerTypes: filters.offerTypes.filter((item: any) => item !== value),
        });
      } else {
        setFilters({
          ...filters,
          offerTypes: [...filters.offerTypes, value],
        });
      }
    },
    [filters]
  );

  const handlePressedCategories = React.useCallback(
    (value: number) => () => {
      const selected = filters.categories.includes(value);

      if (selected) {
        setFilters({
          ...filters,
          categories: filters.categories.filter((item: any) => item !== value),
        });
      } else {
        setFilters({
          ...filters,
          categories: [...filters.categories, value],
        });
      }
    },
    [filters]
  );

  const setRangeHandler = React.useCallback(
    (value: number) => {
      setFilters({
        ...filters,
        range: 2,
      });
    },
    [filters]
  );

  const handleModalClose = () => {
    if (onFiltersSet) {
      onFiltersSet(filters);
    }

    setShowFilters(!showFilters);
  };

  return (
    <>
      <Button
        style={styles.buttonFilter}
        size="small"
        onPress={() => setShowFilters(!showFilters)}
      >
        <FontAwesome size={24} name="filter" />
      </Button>

      <Modal
        animationType="fade"
        visible={showFilters}
        onRequestClose={handleModalClose}
      >
        {Platform.OS === 'ios' ? (
          <View style={{ height: 55, backgroundColor: '#49DA8B' }}></View>
        ) : null}

        <ScrollView>
          <View style={[styles.modalView]}>
            {toShow.includes('offerStatuses') ? (
              <>
                <Text style={styles.title}>Estado</Text>

                <Spacer size={10} />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}
                >
                  {offerStatusesOptions.map(({ label, value }) => (
                    <View
                      key={value}
                      style={{
                        paddingVertical: 5,
                        width: (Layout.window.width - Layout.baseMargin) / 3,
                      }}
                    >
                      <BouncyCheckbox
                        size={25}
                        fillColor="#49DA8B"
                        unfillColor="#FFFFFF"
                        text={label}
                        isChecked={filters.offerStatuses.includes(value)}
                        iconStyle={{ borderColor: '#49DA8B' }}
                        onPress={handlePressedOfferStatuses(value)}
                        textStyle={{
                          textDecorationLine: 'none',
                        }}
                      />
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            {/* {toShow.includes('offerTypes') ? (
              <>
                <Spacer size={20} />

                <Text style={styles.title}>Tipo de anuncio</Text>

                <Spacer size={10} />

                <View style={{ flexDirection: 'row' }}>
                  {offertTypeOptions.map(({ label, value }) => (
                    <View
                      style={{
                        flex: 1,
                        paddingEnd: label === 'Vender' ? 15 : 0,
                      }}
                      key={value}
                    >
                      <Button
                        type={
                          filters.offerTypes.includes(value)
                            ? 'secondary'
                            : 'primary'
                        }
                        onPress={handlePressedOfferTypes(value)}
                      >
                        {mappingType[label]}
                      </Button>
                    </View>
                  ))}
                </View>
              </>
            ) : null} */}

            {toShow.includes('conditions') ? (
              <>
                <Spacer size={20} />

                <Text style={styles.title}>Condición</Text>

                <Spacer size={10} />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                  }}
                >
                  {conditionOptions.map(({ label, value }) => (
                    <View
                      key={value}
                      style={{
                        paddingVertical: 5,
                        width: (Layout.window.width - Layout.baseMargin) / 3,
                      }}
                    >
                      <BouncyCheckbox
                        key={value}
                        size={25}
                        fillColor="#49DA8B"
                        unfillColor="#FFFFFF"
                        text={label}
                        isChecked={filters.conditions.includes(value)}
                        iconStyle={{ borderColor: '#49DA8B' }}
                        onPress={handlePressedConditions(value)}
                        textStyle={{
                          textDecorationLine: 'none',
                        }}
                      />
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            {toShow.includes('categories') ? (
              <>
                <Spacer size={20} />

                <Text style={styles.title}>Categoría</Text>

                <Spacer size={10} />

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'left',
                  }}
                >
                  {(categoriesOptions ?? []).map(
                    ({ label: optionLabel, value }) => (
                      <CategoryItem
                        size={75}
                        key={`${value}-${filters.categories.includes(value)}`}
                        value={value}
                        onPress={handlePressedCategories(value)}
                        selected={filters.categories.includes(value)}
                        label={optionLabel}
                      />
                    )
                  )}
                </View>
              </>
            ) : null}

            {toShow.includes('range') ? (
              <>
                <View
                  style={{
                    paddingVertical: 10,
                  }}
                >
                  <Text style={[styles.text, { marginBottom: 15 }]}>
                    Distancia
                    <Text style={{ fontWeight: '900' }}>
                      {filters.range == '100'
                        ? `+${filters.range}`
                        : filters.range}
                      km
                    </Text>
                  </Text>

                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={filters.range ?? emptyFilters.range}
                    setValue={() => {
                      // setRangeHandler;
                    }}
                  />
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>

        <View style={[Platform.OS === 'ios' ? { paddingBottom: 20 } : {}]}>
          <Button
            type="primary"
            style={[styles.fixedButton]}
            onPress={handleModalClose}
          >
            Filtrar
          </Button>
        </View>
      </Modal>
    </>
  );
};

Filters.getEmptyFilters = () => emptyFilters;

export default Filters;
