import React from "react";
import PropTypes from "prop-types";

import { extractValues } from "../common/RecordForm";
import FormDrawer from "../common/FormDrawer";

const groups = [
    {
        label: "Basic",
        children: [
            {
                label: "Reference ID",
                identifier: "referenceId",
                type: "text",
                required: true,
                readOnly: false,
                quickAdd: true,
                unique: false,
                hidden: false,
                tooltip: "Reference ID of the transaction.",
                multipleValues: false,
                defaultValue: "",
            },
            {
                label: "Comments",
                identifier: "comments",
                type: "large_text",
                required: false,
                readOnly: false,
                quickAdd: true,
                unique: false,
                hidden: false,
                tooltip: "Any comments on the transaction.",
                multipleValues: false,
                defaultValue: "",
                rows: 4,
                validations: "maxLength:200",
                validationErrors: {
                    maxLength: "The comment must be 0-200 characters long.",
                },
            },
            {
                label: "Amount",
                identifier: "amount",
                type: "number",
                required: false,
                readOnly: false,
                quickAdd: true,
                unique: false,
                hidden: false,
                tooltip: "Amount of the transaction.",
                multipleValues: false,
                defaultValue: 0,
                validations: "isNumeric",
                validationErrors: {
                    isNumeric: "Please enter a valid number.",
                },
            },
            {
                label: "Tax",
                identifier: "tax",
                type: "number",
                required: false,
                readOnly: false,
                quickAdd: true,
                unique: false,
                hidden: false,
                tooltip: "Tax of the transaction.",
                multipleValues: false,
                defaultValue: 0,
                validations: "isNumeric",
                validationErrors: {
                    isNumeric: "Please enter a valid number.",
                },
            },
            {
                label: "Action",
                identifier: "action",
                type: "select",
                options: [
                    {
                        value: "purchase",
                        title: "Purchase",
                    },
                    {
                        value: "verify",
                        title: "Verify",
                    },
                    {
                        value: "refund",
                        title: "Refund",
                    },
                ],
                required: false,
                readOnly: false,
                quickAdd: true,
                unique: false,
                hidden: false,
                tooltip: "Action can be purchase, verify or refund.",
                multipleValues: false,
                defaultValue: "purchase",
            },
            {
                label: "Payment Method",
                identifier: "paymentMethod",
                type: "select",
                options: [
                    {
                        value: "cash",
                        title: "Cash",
                    },
                    {
                        value: "credit_card",
                        title: "Credit Card",
                    },
                    {
                        value: "debit_card",
                        title: "Debit Card",
                    },
                    {
                        value: "online",
                        title: "Online / Netbanking",
                    },
                ],
                required: false,
                readOnly: false,
                quickAdd: true,
                unique: false,
                hidden: false,
                tooltip: "Method of Payment.",
                multipleValues: false,
                defaultValue: "cash",
            },
        ],
    },
];

function TransactionFormDrawer(props) {
    const { title, onSave, showMore, open } = props;

    const values = props.transaction || extractValues(groups);
    return (
        <FormDrawer
            title={title}
            showMore={showMore}
            groups={groups}
            values={values}
            onSave={onSave}
            open={open}
        />
    );
}

TransactionFormDrawer.propTypes = {
    title: PropTypes.string.isRequired,
    showMore: PropTypes.bool,
    transaction: PropTypes.object,
    onSave: PropTypes.func.isRequired,
};

TransactionFormDrawer.defaultProps = {
    showMore: false,
    transaction: null,
    onCancel: null,
};

export default TransactionFormDrawer;
