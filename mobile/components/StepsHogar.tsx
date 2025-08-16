import React from 'react';
import { StyleSheet, View } from 'react-native';
import Active1 from '../assets/images/steps/active/1.svg';
import Active2 from '../assets/images/steps/active/2_hogar.svg';
import Active3 from '../assets/images/steps/active/3.svg';
import Active4donar from '../assets/images/steps/active/4_donar.svg';
import Active4Hogar from '../assets/images/steps/active/4_hogar.svg';
import Layout from '../constants/Layout';

import Disabled1 from '../assets/images/steps/disabled/1.svg';
import Disabled2 from '../assets/images/steps/disabled/2_hogar.svg';
import Disabled3 from '../assets/images/steps/disabled/3.svg';
import Disabled4donar from '../assets/images/steps/disabled/4_donar.svg';
import Disabled4 from '../assets/images/steps/disabled/4_h.svg';

type StepsProps = {
  type: number;
  step: number;
};

const styles = StyleSheet.create({
  title: {
    color: '#444',
    fontSize: 20,
    fontFamily: 'Montserrat-ExtraBold',
    marginBottom: 20,
  },
  stepsGeneral: {
    flexDirection: 'row',
    marginTop: 30,
    color: '#444',
    fontSize: 20,
    fontFamily: 'Montserrat-ExtraBold',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineBack: {
    width: Layout.window.width - 20 * 3,
    backgroundColor: '#f5f5f5',
    height: 3,
    position: 'absolute',
    top: Layout.window.width > 390 ? 40 : 25,
    left: 15,
  },
  lineadv: {
    width: Layout.window.width - 20 * 3,
    backgroundColor: '#e2fef1',
    height: 3,
    position: 'absolute',
    top: Layout.window.width > 390 ? 40 : 25,
    left: 15,
  },
  step: {
    width: (Layout.window.width - 20 * 5) / 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: (Layout.window.width - 20 * 5) / 4,
    marginRight: 20,
  },
  stepActive: {
    backgroundColor: '#e2fef1',
  },
  stepFocus: {
    borderColor: '#39ce67',
    borderWidth: 2,
  },
});

function Steps({ type, step }: StepsProps) {
  const icons = {
    active_1: <Active1 style={{ transform: [{ scale: 0.7 }] }} />,
    active_2: <Active2 style={{ transform: [{ scale: 0.7 }] }} />,
    active_3: <Active3 style={{ transform: [{ scale: 0.7 }] }} />,
    active_4: <Active4Hogar style={{ transform: [{ scale: 0.7 }] }} />,
    active_4_donar: <Active4donar style={{ transform: [{ scale: 0.7 }] }} />,

    disabled_1: <Disabled1 style={{ transform: [{ scale: 0.7 }] }} />,
    disabled_2: <Disabled2 style={{ transform: [{ scale: 0.7 }] }} />,
    disabled_3: <Disabled3 style={{ transform: [{ scale: 0.7 }] }} />,
    disabled_4: <Disabled4 style={{ transform: [{ scale: 0.7 }] }} />,
    disabled_4_donar: (
      <Disabled4donar style={{ transform: [{ scale: 0.7 }] }} />
    ),
  };
  return (
    <>
      <View style={styles.stepsGeneral}>
        <View style={styles.lineBack} />
        <View style={[styles.lineadv, { width: 80 * step }]} />

        <View
          style={[
            styles.step,
            step > 2 ? styles.stepActive : null,
            step === 2 ? styles.stepFocus : null,
          ]}
        >
          {icons[`${step > 2 ? 'active' : 'disabled'}_2`]}
        </View>

        <View
          style={[
            styles.step,
            step > 3 ? styles.stepActive : null,
            step === 3 ? styles.stepFocus : null,
          ]}
        >
          {icons[`${step > 3 ? 'active' : 'disabled'}_3`]}
        </View>

        <View
          style={[
            styles.step,
            step > 4 ? styles.stepActive : null,
            step === 4 ? styles.stepFocus : null,
          ]}
        >
          {
            icons[
              `${step > 4 ? 'active' : 'disabled'}_4${
                type === 2 ? '_donar' : ''
              }`
            ]
          }
        </View>
      </View>
    </>
  );
}
Steps.defaultProps = {};

export default Steps;
