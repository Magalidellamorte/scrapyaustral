export type Filters = {
  conditions: string[];
  offerTypes: string[];
  categories: string[];
  view: string;
  userId: number;
  range: number;
  type: string;
  offerStatuses: string[];
};

const getStringFromFilters = (filters: Filters) => {
  const filterString = [];

  if (filters?.search?.length > 0) {
    filterString.push(`search=${filters.search}`);
  }

  if (filters.conditions.length > 0) {
    filterString.push(
      Object.keys(filters.conditions)
        .map((key) => `conditions[]=${filters.conditions[key]}`)
        .join('&')
    );
  }

  if (filters.offerTypes.length > 0) {
    filterString.push(
      Object.keys(filters.offerTypes)
        .map((key) => `offerTypes[]=${filters.offerTypes[key]}`)
        .join('&')
    );
  }

  if (filters.offerStatuses.length > 0) {
    filterString.push(
      Object.keys(filters.offerStatuses)
        .map((key) => `offerStatuses[]=${filters.offerStatuses[key]}`)
        .join('&')
    );
  }

  if (filters.categories.length > 0) {
    filterString.push(
      Object.keys(filters.categories)
        .map((key) => `categories[]=${filters.categories[key]}`)
        .join('&')
    );
  }

  if (filters?.range) {
    filterString.push(`distance=${filters.range}`);
  }
  if (filters?.view) {
    filterString.push(`view=${filters.view}`);
  }
  if (filters?.userId) {
    filterString.push(`userId=${filters.userId}`);
  }
  if (filters?.type) {
    filterString.push(`type=${filters.type}`);
  }

  return filterString.length ? `&${filterString.join('&')}` : '';
};

export default getStringFromFilters;
