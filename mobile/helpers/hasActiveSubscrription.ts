import moment from 'moment';

function hasActiveSubscription(subscriptions) {
  const active = subscriptions.filter((subscription) => {
    if (moment().isBefore(subscription.trial_ends_at)) {
      return true;
    }
    const invoiceData=subscription.invoices[0] || null;
    if(invoiceData){
      if (
        moment().isAfter(subscription.trial_ends_at) &&
        invoiceData.paid_at === null
      ) {
        return false;
      }
    }
    if (
      subscription.invoices.every((invoice) => invoice.paid_at !== null) &&
      moment().isBefore(subscription.ends_at)
    ) {
      return true;
    }

    if (
      subscription.invoices.some((invoice) => invoice.paid_at === null) &&
      moment().isBefore(subscription.ends_at)
    ) {
      return true;
    }

    return moment().isBefore(subscription.ends_at);
  });

  return !!active.length;
}

export default hasActiveSubscription;
