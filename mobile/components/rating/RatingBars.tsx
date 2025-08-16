/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Rating from '../Rating';
import Title from '../Title';
import RatingBar from './RatingBar';
import RatingImg from './RatingImg';

const styles = StyleSheet.create({
  ratingGeneral: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    marginBottom: 10,
  },
  ratingGrey: {
    backgroundColor: '#eee',
    borderRadius: 20,
    height: 25,
    flex: 0.7,
  },
  ratingGreen: {
    backgroundColor: '#49DA8B',
    height: 25,
    alignItems: 'center',
    borderRadius: 20,
  },
  container: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 20,
  },
  invoiceContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  noRatingText: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  ratingText: { flex: 0.3, alignItems: 'center' },
});
type RatingBarsProps = {
  withComments?: boolean;
  onlySelected?: boolean;
  onlySelectedLite?: boolean;
  user?: any;
};

const processRating = (user: any) => {
  let excelent: number = 0;
  let regular: number = 0;
  let bad: number = 0;
  // eslint-disable-next-line array-callback-return
  user?.data?.rating_as_client.map((rating: any) => {
    if (parseInt(rating.rating, 10) === 1) {
      excelent += 1;
    }
    if (parseInt(rating.rating, 10) === 2) {
      regular += 1;
    }
    if (parseInt(rating.rating, 10) === 3) {
      bad += 1;
    }
  });
  // eslint-disable-next-line array-callback-return
  user?.data?.rating_as_scraper.map((rating: any) => {
    if (parseInt(rating.rating, 10) === 1) {
      excelent += 1;
    }
    if (parseInt(rating.rating, 10) === 2) {
      regular += 1;
    }
    if (parseInt(rating.rating, 10) === 3) {
      bad += 1;
    }
  });

  const total: number = excelent + regular + bad;

  return [excelent, regular, bad, total];
};

function RatingBars({
  withComments,
  user,
  onlySelected,
  onlySelectedLite,
}: RatingBarsProps) {
  const [dataUser, setDataUser] = useState(user);
  useEffect(() => {
    if (!dataUser.data) {
      setDataUser({ data: dataUser });
    }
  }, [dataUser]);

  const [excelent, regular, bad, total] = processRating(dataUser);
  let id = 0;
  if (excelent > regular && excelent > bad) {
    id = 1;
  } else if (regular > excelent && regular > bad) {
    id = 2;
  } else if (bad > excelent && bad > regular) {
    id = 3;
  } else {
    id = 2;
  }

  return (
    <>
      <View
        style={
          onlySelected && {
            alignContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            flexDirection: 'row',
          }
        }
      >
        {onlySelected ? (
          <>
            <RatingImg
              style={{ width: 25, height: 25, marginTop: -12, marginRight: 10 }}
              id={id}
            />
          </>
        ) : (
          <>
            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 30,
                marginTop: 30,
              }}
            >
              <RatingImg id={id} />
            </View>
          </>
        )}
        <RatingBar
          cantidad={excelent}
          total={total}
          id={1}
          idSelected={id}
          showMatch={onlySelected}
          onlyLabel={onlySelectedLite}
          label="Excelente"
        />
        <RatingBar
          cantidad={regular}
          total={total}
          id={2}
          idSelected={id}
          showMatch={onlySelected}
          onlyLabel={onlySelectedLite}
          label="Regular"
        />
        <RatingBar
          cantidad={bad}
          total={total}
          id={3}
          idSelected={id}
          showMatch={onlySelected}
          onlyLabel={onlySelectedLite}
          label="Malo"
        />
      </View>

      {withComments && (
        <>
          <View style={{ marginTop: 30 }}>
            {(dataUser?.data?.rating_as_client || []).length ||
            (dataUser?.data?.rating_as_scraper || []).length ? (
              <Title>Calificaciones</Title>
            ) : null}
            <View style={styles.content}>
              {(dataUser?.data?.rating_as_client || []).length ? (
                <>
                  {dataUser?.data?.rating_as_client.map((rating: any) => (
                    <Rating key={rating.id} rating={rating} />
                  ))}
                </>
              ) : null}

              {(dataUser?.data?.rating_as_scraper || []).length ? (
                <>
                  {dataUser?.data?.rating_as_scraper.map((rating: any) => (
                    <Rating key={rating.id} rating={rating} />
                  ))}
                </>
              ) : null}
            </View>
          </View>
        </>
      )}
    </>
  );
}

RatingBars.defaultProps = {
  withComments: false,
  onlySelected: false,
  onlySelectedLite: false,
  user: {},
};

export default RatingBars;
