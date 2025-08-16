import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStoredState = <T>(
  key: string,
  defaultValue: T,
): [T, (newValue: T) => void, boolean] => {
  const [state, setState] = React.useState({
    hydrated: false,
    storageValue: defaultValue,
  })
  const {hydrated, storageValue} = state

  React.useEffect(() => {
    const pullFromStorage = async () => {
      let value = defaultValue
      try {
        const fromStorage = await AsyncStorage.getItem(key)
        if (fromStorage) {
          value = JSON.parse(fromStorage)
        }
      } catch (e) {
        console.log('Could not read from storage for key: ', key, e)
      }

      return value
    }
    pullFromStorage().then((value) => {
      setState({hydrated: true, storageValue: value})
    })
  }, [key])

  const updateStorage = React.useCallback(
    async (newValue: T) => {
      setState({hydrated: true, storageValue: newValue})
      await AsyncStorage.setItem(key, JSON.stringify(newValue))
    },
    [key],
  )

  return [storageValue, updateStorage, hydrated]
}

export default useStoredState