import faker from "faker";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

export const mock = new MockAdapter(axios, { delayResponse: 0 });

const DEFAULT_PLANS = 10;
const DEFAULT_ACCOUNTS = 100;
const DEFAULT_SUBSCRIPTIONS = 100 * 5;
const DEFAULT_TRANSACTIONS = 100;
const DEFAULT_INVOICES = 100;

export const plans = [];
export const accounts = [];
export const subscriptions = [];
export const transactions = [];
export const invoices = [];
export const analytics = {};

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const paymentMethods = ["cash", "credit_card", "debit_card", "online"];

const actions = ["purchase", "verify", "refund"];

const periodUnits = ["days", "months"];

const invoiceStatuses = [
    "pending",
    "processing",
    "pastDue",
    "paid",
    "failed",
    "voided",
    "closed",
];

const invoiceOrigins = [
    "all",
    "purchase",
    "renewal",
    "immediateChange",
    "termination",
    "refund",
    "postedCredit",
    "giftCardRedemption",
    "writeOff",
    "carryforwardCredit",
    "carryforwardGiftCredit",
    "usageCorrection",
];

const collectionMethods = ["automatic", "manual"];

function futureDate() {
    return faker.date.future().toISOString();
}

function pastDate() {
    return faker.date.past().toISOString();
}

function soonDate() {
    return faker.date.future().toISOString();
}

// TODO: We could improve periods generated to be more realistic for months.
function createPlan() {
    const plan = {
        identifier: faker.random.uuid(),
        name: faker.commerce.productName(),
        code: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        billingPeriod: faker.random.number({
            min: 0,
            max: 6 * 30,
        }),
        billingPeriodUnit: faker.random.arrayElement(periodUnits),
        pricePerBillingPeriod: faker.random.number(),
        setupFee: faker.random.number(),
        trialPeriod: faker.random.number({
            min: 0,
            max: 6 * 30,
        }),
        trialPeriodUnit: faker.random.arrayElement(periodUnits),
        starts: soonDate(),
        term: faker.random.number({
            min: 0,
            max: 6 * 30,
        }),
        termUnit: faker.random.arrayElement(periodUnits),
        renews: faker.random.boolean(),
        createdOn: pastDate(),
    };
    return plan;
}

function createAccount() {
    const account = {
        identifier: faker.random.uuid(),
        userName: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        emailAddress: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber(),
        addressLine1: faker.address.streetAddress(),
        addressLine2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
        subscriptions: [],
        createdOn: pastDate(),
    };
    return account;
}

function createInvoiceItems() {
    const limit = faker.random.number({
        min: 1,
        max: 10,
    });
    const result = [];
    for (let i = 0; i < limit; i++) {
        const item = {
            startDate: pastDate(),
            endDate: pastDate(),
            description: faker.lorem.sentence(),
            quantity: faker.random.number(),
            price: faker.random.number(),
            subtotal: faker.random.number(),
            amountDue: faker.random.number(),
        };
        result.push(item);
    }
    return result;
}

function createInvoice() {
    const invoice = {
        identifier: faker.random.uuid(),
        invoiceNumber: faker.random.number({
            min: 1000,
        }),
        postedOn: pastDate(),
        dueOn: futureDate(),
        account: faker.random.arrayElement(accounts),
        status: faker.random.arrayElement(invoiceStatuses),
        total: faker.random.number(),
        subtotal: faker.random.number(),
        paid: faker.random.number(),
        amountDue: faker.random.number(),
        origin: faker.random.arrayElement(invoiceOrigins),
        subscription: faker.random.arrayElement(subscriptions),
        notes: faker.lorem.lines(),
        termsAndConditions: faker.lorem.paragraph(),
        items: createInvoiceItems(),
    };
    return invoice;
}

/* Subscriptions can have different values from the plans they are associated with.
 * In other words, a plan is a template from which we create a subscription. However,
 * when we generate a fake subscription here, we do not change the values. In the
 * future, we may want to introduce this behavior.
 *
 * Technically, Hubble does not allow an account to hold multiple subscriptions to
 * the same plan. We do not enforce such complex behavior here.
 */
function createSubscription() {
    const plan = faker.random.arrayElement(plans);
    const account = faker.random.arrayElement(accounts);
    const accountCopy = { ...account };
    delete accountCopy.subscriptions;

    const totalBillingCycles = faker.random.number({
        min: 0,
        max: 60,
    });
    const remainingBillingCycles = faker.random.number({
        min: 0,
        max: 60,
    });
    const subscription = {
        identifier: faker.random.uuid(),
        plan: plan,
        account: accountCopy,
        quantity: faker.random.number({
            min: 0,
            max: 100,
        }),
        quantityType: "integer",
        createdAt: pastDate(),
        updatedAt: pastDate(),
        totalBillingCycles: totalBillingCycles,
        remainingBillingCycles: remainingBillingCycles,
        trialStart: futureDate(),
        trialEnd: futureDate(),
        collectionMethod: faker.random.arrayElement(collectionMethods),
        billingPeriod: plan.billingPeriod,
        billingPeriodUnit: plan.billingPeriodUnit,
        setupFee: plan.setupFee,
        trialPeriod: plan.trialPeriod,
        trialPeriodUnit: plan.trialPeriodUnit,
        starts: plan.starts,
        term: plan.term,
        termUnit: plan.termUnit,
        renew: plan.renew,
        createdOn: pastDate(),
    };

    account.subscriptions.push(subscription);

    return subscription;
}

function createTransaction() {
    const subscription = faker.random.arrayElement(subscriptions);

    const transaction = {
        identifier: faker.random.uuid(),
        subscription: subscription,
        comments: faker.lorem.paragraph(),
        amount: faker.random.number(),
        tax: faker.random.number(),
        action: faker.random.arrayElement(actions),
        paymentMethod: faker.random.arrayElement(paymentMethods),
        refundable: faker.random.boolean(),
        createdOn: pastDate(),
    };

    return transaction;
}

function generateFakeData() {
    for (let i = 0; i < DEFAULT_PLANS; i++) {
        const plan = createPlan();
        plans.push(plan);
    }

    for (let i = 0; i < DEFAULT_ACCOUNTS; i++) {
        const account = createAccount();
        accounts.push(account);
    }

    for (let i = 0; i < DEFAULT_SUBSCRIPTIONS; i++) {
        const subscription = createSubscription();
        subscriptions.push(subscription);
    }

    for (let i = 0; i < DEFAULT_TRANSACTIONS; i++) {
        const transaction = createTransaction();
        transactions.push(transaction);
    }

    for (let i = 0; i < DEFAULT_INVOICES; i++) {
        const invoice = createInvoice();
        invoices.push(invoice);
    }
}

generateFakeData();

// Plans

mock.onPost("/api/v1/plans").reply((request) => {
    const plan = JSON.parse(request.data);
    plan.id = faker.random.uuid();
    plans.push(plan);

    return [200, plan];
});

// TODO: Paging
mock.onGet("/api/v1/plans").reply((request) => {
    return [200, plans];
});

const GET_PLAN_URL = /\/api\/v1\/plans\/([a-zA-Z0-9-]+)/;
mock.onGet(GET_PLAN_URL).reply((request) => {
    const identifier = GET_PLAN_URL.exec(request.url)[1];
    const plan = plans.find((plan) => plan.identifier === identifier);
    if (plan) {
        return [200, plan];
    } else {
        return [404];
    }
});

/* NOTE: The user can easily modify the identifier of a record.
 * However, the backend does not permit such operations.
 */
const PUT_PLAN_URL = /\/api\/v1\/plans\/([a-zA-Z0-9-]+)/;
mock.onPut(PUT_PLAN_URL).reply((request) => {
    const newPlan = JSON.parse(request.data);
    const identifier = PUT_PLAN_URL.exec(request.url)[1];
    const index = plans.findIndex((plan) => {
        return plan.identifier === identifier;
    });

    if (index >= 0) {
        plans[index] = newPlan;
        return [200, newPlan];
    } else {
        return [404];
    }
});

// Accounts

mock.onPost("/api/v1/accounts").reply((request) => {
    const account = JSON.parse(request.data);
    account.id = faker.random.uuid();
    accounts.push(account);

    return [200, account];
});

// TODO: Paging
mock.onGet("/api/v1/accounts").reply((request) => {
    return [200, accounts];
});

const GET_ACCOUNT_URL = /\/api\/v1\/accounts\/([a-zA-Z0-9-]+)/;
mock.onGet(GET_ACCOUNT_URL).reply((request) => {
    const identifier = GET_ACCOUNT_URL.exec(request.url)[1];
    let account = accounts.find((account) => {
        return account.identifier === identifier;
    });

    if (account) {
        // TODO: Solve the recursive problem.
        delete account.subscriptions;
        return [200, account];
    } else {
        return [404];
    }
});

/* NOTE: The user can easily modify the identifier of a record.
 * However, the backend does not permit such operations.
 */
const PUT_ACCOUNT_URL = /\/api\/v1\/accounts\/([a-zA-Z0-9-]+)/;
mock.onPut(PUT_ACCOUNT_URL).reply((request) => {
    const newAccount = JSON.parse(request.data);
    const identifier = PUT_ACCOUNT_URL.exec(request.url)[1];
    const index = accounts.findIndex((account) => {
        return account.identifier === identifier;
    });

    if (index >= 0) {
        accounts[index] = newAccount;
        return [200, newAccount];
    } else {
        return [404];
    }
});

// Subscriptions

mock.onPost("/api/v1/subscriptions").reply((request) => {
    const subscription = JSON.parse(request.data);
    subscription.id = faker.random.uuid();
    subscriptions.push(subscription);

    return [200, subscription];
});

// TODO: Paging
mock.onGet("/api/v1/subscriptions").reply((request) => {
    return [200, subscriptions];
});

const GET_SUBSCRIPTION_URL = /\/api\/v1\/subscriptions\/([a-zA-Z0-9-]+)/;
mock.onGet(GET_SUBSCRIPTION_URL).reply((request) => {
    const identifier = GET_SUBSCRIPTION_URL.exec(request.url)[1];
    const subscription = subscriptions.find(
        (subscription) => subscription.identifier === identifier
    );
    if (subscription) {
        delete subscription.account;
        return [200, subscription];
    } else {
        return [404];
    }
});

/* NOTE: The user can easily modify the identifier of a record.
 * However, the backend does not permit such operations.
 */
const PUT_SUBSCRIPTION_URL = /\/api\/v1\/subscriptions\/([a-zA-Z0-9-]+)/;
mock.onPut(PUT_SUBSCRIPTION_URL).reply((request) => {
    const newSubscription = JSON.parse(request.data);
    const identifier = PUT_SUBSCRIPTION_URL.exec(request.url)[1];
    const index = subscriptions.findIndex((subscription) => {
        return subscription.identifier === identifier;
    });

    if (index >= 0) {
        subscriptions[index] = newSubscription;
        return [200, newSubscription];
    } else {
        return [404];
    }
});

// Transactions

mock.onPost("/api/v1/transactions").reply((request) => {
    const transaction = JSON.parse(request.data);
    transaction.id = faker.random.uuid();
    transactions.push(transaction);

    return [200, transaction];
});

// TODO: Paging
mock.onGet("/api/v1/transactions").reply((request) => {
    return [200, transactions];
});

const GET_TRANSACTION_URL = /\/api\/v1\/transactions\/([a-zA-Z0-9-]+)/;
mock.onGet(GET_TRANSACTION_URL).reply((request) => {
    const identifier = GET_TRANSACTION_URL.exec(request.url)[1];
    const transaction = transactions.find(
        (transaction) => transaction.identifier === identifier
    );
    if (transaction) {
        return [200, transaction];
    } else {
        return [404];
    }
});

const PUT_TRANSACTION_URL = /\/api\/v1\/transactions\/([a-zA-Z0-9-]+)/;
mock.onPut(PUT_TRANSACTION_URL).reply((request) => {
    const newTransaction = JSON.parse(request.data);
    const identifier = PUT_TRANSACTION_URL.exec(request.url)[1];
    const index = transactions.findIndex((transaction) => {
        return transaction.identifier === identifier;
    });

    if (index >= 0) {
        transactions[index] = newTransaction;
        return [200, newTransaction];
    } else {
        return [404];
    }
});

// Invoice

mock.onPost("/api/v1/invoices").reply((request) => {
    const invoice = JSON.parse(request.data);
    invoice.id = faker.random.uuid();
    invoice.push(invoice);

    return [200, invoice];
});

// TODO: Paging
mock.onGet("/api/v1/invoices").reply((request) => {
    return [200, invoices];
});

const GET_INVOICE_URL = /\/api\/v1\/invoices\/([a-zA-Z0-9-]+)/;
mock.onGet(GET_INVOICE_URL).reply((request) => {
    const identifier = GET_INVOICE_URL.exec(request.url)[1];
    const invoice = invoices.find(
        (invoice) => invoice.identifier === identifier
    );
    if (invoice) {
        return [200, invoice];
    } else {
        return [404];
    }
});

/* NOTE: The user can easily modify the identifier of a record.
 * However, the backend does not permit such operations.
 */
const PUT_INVOICE_URL = /\/api\/v1\/invoices\/([a-zA-Z0-9-]+)/;
mock.onPut(PUT_INVOICE_URL).reply((request) => {
    const newInvoice = JSON.parse(request.data);
    const identifier = PUT_INVOICE_URL.exec(request.url)[1];
    const index = invoices.findIndex((invoice) => {
        return invoice.identifier === identifier;
    });

    if (index >= 0) {
        invoices[index] = newInvoice;
        return [200, newInvoice];
    } else {
        return [404];
    }
});

// Analytics Data

function createSubscriberData() {
    const subscriberData = [];
    for (let i = 0; i < months.length; i++) {
        subscriberData.push(faker.random.number({ max: 100 }));
    }
    return subscriberData;
}

function createRevenueData() {
    const revenueData = [];
    for (let i = 0; i < months.length; i++) {
        const item = {
            month: months[i],
            "Billed Revenue": faker.random.number(),
            "Revenue Past Due": faker.random.number(),
        };
        revenueData.push(item);
    }
    return revenueData;
}

function createPlanData() {
    const planData = [];
    for (let i = 0; i < months.length; i++) {
        const item = {
            month: months[i],
            "Gold Plan": faker.random.number(),
            "Silver Plan": faker.random.number(),
            "Bronze Plan": faker.random.number(),
            "Platinum Plan": faker.random.number(),
        };
        planData.push(item);
    }
    return planData;
}

function generateAnalyticsFakeData() {
    analytics.subscriberData = createSubscriberData();
    analytics.revenueData = createRevenueData();
    analytics.planData = createPlanData();
}

generateAnalyticsFakeData();

mock.onGet("/api/v1/analytics").reply((request) => {
    return [200, analytics];
});
