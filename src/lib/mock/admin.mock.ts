type FormData = { name: string; value: number };

interface AdminData {
    draftingForm: FormData[];
    pendingForm: FormData[];
    rejectedForm: FormData[];
    canceledForm: FormData[];
    approvedForm: FormData[];
    paidForm: FormData[];
    staffs: FormData[];
    projects: FormData[];
    getFinalData: (key: keyof AdminData) => number;
}

const admin_data: AdminData = {
    draftingForm: [
        { name: "Jan", value: 20 },
        { name: "Feb", value: 30 },
        { name: "Mar", value: 60 },
        { name: "Apr", value: 50 },
        { name: "May", value: 70 },
        { name: "Jun", value: 40 },
        { name: "Jul", value: 20 },
        { name: "Aug", value: 50 },
        { name: "Sep", value: 40 },
        { name: "Oct", value: 30 },
        { name: "Nov", value: 20 },
        { name: "Dec", value: 40 },
    ],
    pendingForm: [
        { name: "Jan", value: 40 },
        { name: "Feb", value: 50 },
        { name: "Mar", value: 70 },
        { name: "Apr", value: 60 },
        { name: "May", value: 80 },
        { name: "Jun", value: 50 },
        { name: "Jul", value: 30 },
        { name: "Aug", value: 60 },
        { name: "Sep", value: 50 },
        { name: "Oct", value: 40 },
        { name: "Nov", value: 35 },
        { name: "Dec", value: 27 },
    ],
    rejectedForm: [
        { name: "Jan", value: 30 },
        { name: "Feb", value: 40 },
        { name: "Mar", value: 70 },
        { name: "Apr", value: 60 },
        { name: "May", value: 75 },
        { name: "Jun", value: 50 },
        { name: "Jul", value: 30 },
        { name: "Aug", value: 60 },
        { name: "Sep", value: 50 },
        { name: "Oct", value: 40 },
        { name: "Nov", value: 35 },
        { name: "Dec", value: 51 },
    ],
    canceledForm: [
        { name: "Jan", value: 30 },
        { name: "Feb", value: 40 },
        { name: "Mar", value: 70 },
        { name: "Apr", value: 60 },
        { name: "May", value: 75 },
        { name: "Jun", value: 50 },
        { name: "Jul", value: 30 },
        { name: "Aug", value: 60 },
        { name: "Sep", value: 50 },
        { name: "Oct", value: 47 },
        { name: "Nov", value: 35 },
        { name: "Dec", value: 45 },
    ],
    approvedForm: [
        { name: "Jan", value: 50 },
        { name: "Feb", value: 60 },
        { name: "Mar", value: 50 },
        { name: "Apr", value: 25 },
        { name: "May", value: 62 },
        { name: "Jun", value: 48 },
        { name: "Jul", value: 30 },
        { name: "Aug", value: 62 },
        { name: "Sep", value: 50 },
        { name: "Oct", value: 40 },
        { name: "Nov", value: 35 },
        { name: "Dec", value: 39 },
    ],
    paidForm: [
        { name: "Jan", value: 40 },
        { name: "Feb", value: 50 },
        { name: "Mar", value: 70 },
        { name: "Apr", value: 60 },
        { name: "May", value: 80 },
        { name: "Jun", value: 50 },
        { name: "Jul", value: 30 },
        { name: "Aug", value: 60 },
        { name: "Sep", value: 50 },
        { name: "Oct", value: 40 },
        { name: "Nov", value: 35 },
        { name: "Dec", value: 59 },
    ],
    staffs: [
        { name: "Jan", value: 49 },
        { name: "Feb", value: 50 },
        { name: "Mar", value: 50 },
        { name: "Apr", value: 50 },
        { name: "May", value: 49 },
        { name: "Jun", value: 49 },
        { name: "Jul", value: 51 },
        { name: "Aug", value: 56 },
        { name: "Sep", value: 56 },
        { name: "Oct", value: 56 },
        { name: "Nov", value: 55 },
        { name: "Dec", value: 57 },
    ],
    projects: [
        { name: "Jan", value: 5 },
        { name: "Feb", value: 4 },
        { name: "Mar", value: 7 },
        { name: "Apr", value: 6 },
        { name: "May", value: 8 },
        { name: "Jun", value: 5 },
        { name: "Jul", value: 3 },
        { name: "Aug", value: 6 },
        { name: "Sep", value: 5 },
        { name: "Oct", value: 4 },
        { name: "Nov", value: 3 },
        { name: "Dec", value: 3 },
    ],
    getFinalData: function (key: keyof AdminData): number {
        const data = this[key] as FormData[];
        return data && data.length > 0 ? data[data.length - 1].value : 0;
    }
};

export default admin_data;