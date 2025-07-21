import type { Actions, PageServerLoad } from '../$types';
import { fail, redirect } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

const DEFAULT_EXPENSES = [
	{ description: 'Groceries' },
	{ description: 'Car' },
	{ description: 'Housing' },
	{ description: 'Investments' },
	{ description: 'Loans' },
	{ description: 'Fun' },
	{ description: 'Other' }
];

const DEFAULT_CAR = [
	{ description: 'Car Payment' },
	{ description: 'Gas' },
	{ description: 'Car Insurance' },
	{ description: 'Maintenance' },
	{ description: 'Registration' },
	{ description: 'Other' }
];

const DEFAULT_HOUSING = [
	{ description: 'Rent/Mortgage' },
	{ description: 'Tithing' },
	{ description: 'Electricity Bill' },
	{ description: 'Home Insurance' },
	{ description: 'Toiletries' },
	{ description: 'Other' }
];

const DEFAULT_INVESTMENTS = [
	{ description: 'Retirement Savings' },
	{ description: 'Savings Deposit' },
	{ description: '529 College Savings' },
	{ description: 'Other Investments' }
];

const DEFAULT_LOANS = [
	{ description: 'Personal Loans' },
	{ description: 'Credit Card Payments' }
];

const DEFAULT_FUN = [
	{ description: 'Dining Out' },
	{ description: 'Entertainment' },
	{ description: 'Subscriptions' },
	{ description: 'Ashtyn Fun' },
	{ description: 'Isaac Fun' },
	{ description: 'Wells Fun' },
];

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/');
	}

	// locals.user is guaranteed to be non-null after the above check
	const [fullUser] = await db.select().from(table.user).where(eq(table.user.id, locals.user.id));
	const { passwordHash, ...safeUser } = fullUser; // remove password
	// Check existing expenses
	let userExpenses = await db.select().from(table.expenses).where(eq(table.expenses.userId, locals.user.id));
	let userInvestments = await db.select().from(table.investments).where(eq(table.investments.userId, locals.user.id));
	let userHousing = await db.select().from(table.housing).where(eq(table.housing.userId, locals.user.id));
	let userCar = await db.select().from(table.car).where(eq(table.car.userId, locals.user.id));
	let userLoans = await db.select().from(table.loans).where(eq(table.loans.userId, locals.user.id));
	let userFun = await db.select().from(table.fun).where(eq(table.fun.userId, locals.user.id));

    // ✅ Auto-create default expenses if user has none
	async function ensureDefaults(
		tableRef: typeof table.expenses | typeof table.car | typeof table.housing | typeof table.investments | typeof table.loans | typeof table.fun,
		userId: string,
		defaults: { description: string }[]
	) {
		let items = await db.select().from(tableRef).where(eq(tableRef.userId, userId));
		if (items.length === 0) {
			await db.insert(tableRef).values(
				defaults.map((exp) => ({
					id: generateId(),
					description: exp.description,
					amount: 0,
					actualAmount: 0,
					userId
				}))
			);
			items = await db.select().from(tableRef).where(eq(tableRef.userId, userId));
		}
		return items;
	}

	userExpenses = await ensureDefaults(table.expenses, locals.user.id as string, DEFAULT_EXPENSES);
	userCar = await ensureDefaults(table.car, locals.user.id as string, DEFAULT_CAR);
	userHousing = await ensureDefaults(table.housing, locals.user.id as string, DEFAULT_HOUSING);
	userInvestments = await ensureDefaults(table.investments, locals.user.id as string, DEFAULT_INVESTMENTS);
	userLoans = await ensureDefaults(table.loans, locals.user.id as string, DEFAULT_LOANS);
	userFun = await ensureDefaults(table.fun, locals.user.id as string, DEFAULT_FUN);

    // Fetch existing groceries
    let groceryItems = await db
        .select()
        .from(table.grocery)
        .where(eq(table.grocery.userId, locals.user.id));

    // If empty, create default weeks
    if (groceryItems.length === 0) {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const newGroceryItems = Array.from({ length: 5 }, (_, i) => ({
			id: `${locals.user!.id}-${month}-week-${i + 1}`,
            amount: 0,
			userId: locals.user!.id
        }));

        await db.insert(table.grocery).values(newGroceryItems);

        // Fetch again after inserting
        groceryItems = await db
            .select()
            .from(table.grocery)
            .where(eq(table.grocery.userId, locals.user.id));
    }

    return {
        user: safeUser,
        expenses: userExpenses,
		investments: userInvestments,
		housing: userHousing,
		car: userCar,
		loans: userLoans,
		fun: userFun,
        groceryItems
    };
};

export const actions: Actions = {
	update_expense: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const rawExpense = formData.get('expense');

		if (typeof rawExpense !== 'string') {
			return fail(400, { message: 'Invalid data' });
		}

		try {
			const expense = JSON.parse(rawExpense);

			if (!expense.description) {
				return fail(400, { message: 'Missing expense description' });
			}

			// Update expense based on description + userId
			await db.update(table.expenses)
				.set({
					amount: expense.estimatedAmount,
					actualAmount: expense.actualAmount
				})
				.where(
					and(
						eq(table.expenses.userId, locals.user.id),
						eq(table.expenses.description, String(expense.description))
					)
				);

			// Optional: if you want to also store actualAmount separately, you can expand the schema later
		} catch (err) {
			console.error('Failed to update expense', err);
			return fail(500, { message: 'Internal Server Error' });
		}

		return { success: true };
	},

	update_investment: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const rawInvestment = formData.get('investment');

		if (typeof rawInvestment !== 'string') {
			return fail(400, { message: 'Invalid data' });
		}

		try {
			const investment = JSON.parse(rawInvestment);

			if (!investment.description) {
				return fail(400, { message: 'Missing investment description' });
			}

			await db.update(table.investments)
				.set({
					amount: investment.estimatedAmount,
					actualAmount: investment.actualAmount
				})
				.where(
					and(
						eq(table.investments.userId, locals.user.id),
						eq(table.investments.description, String(investment.description))
					)
				);
		} catch (err) {
			console.error('Failed to update investment', err);
			return fail(500, { message: 'Internal Server Error' });
		}

		return { success: true };
	},

	update_housing: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const rawHousing = formData.get('housing');

		if (typeof rawHousing !== 'string') {
			return fail(400, { message: 'Invalid data' });
		}

		try {
			const housing = JSON.parse(rawHousing);

			if (!housing.description) {
				return fail(400, { message: 'Missing housing description' });
			}

			await db.update(table.housing)
				.set({
					amount: housing.estimatedAmount,
					actualAmount: housing.actualAmount
				})
				.where(
					and(
						eq(table.housing.userId, locals.user.id),
						eq(table.housing.description, String(housing.description))
					)
				);
		} catch (err) {
			console.error('Failed to update housing', err);
			return fail(500, { message: 'Internal Server Error' });
		}
		return { success: true };
	},

	update_loan: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const rawLoan = formData.get('loan');

		if (typeof rawLoan !== 'string') {
			return fail(400, { message: 'Invalid data' });
		}

		try {
			const loan = JSON.parse(rawLoan);

			if (!loan.description) {
				return fail(400, { message: 'Missing loan description' });
			}

			await db.update(table.loans)
				.set({
					amount: loan.estimatedAmount,
					actualAmount: loan.actualAmount
				})
				.where(
					and(
						eq(table.loans.userId, locals.user.id),
						eq(table.loans.description, String(loan.description))
					)
				);
		} catch (err) {
			console.error('Failed to update loan', err);
			return fail(500, { message: 'Internal Server Error' });
		}
		return { success: true };
	},

	update_fun: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const rawFun = formData.get('fun');

		if (typeof rawFun !== 'string') {
			return fail(400, { message: 'Invalid data' });
		}

		try {
			const fun = JSON.parse(rawFun);

			if (!fun.description) {
				return fail(400, { message: 'Missing fun description' });
			}

			await db.update(table.fun)
				.set({
					amount: fun.estimatedAmount,
					actualAmount: fun.actualAmount
				})
				.where(
					and(
						eq(table.fun.userId, locals.user.id),
						eq(table.fun.description, String(fun.description))
					)
				);
		} catch (err) {
			console.error('Failed to update fun', err);
			return fail(500, { message: 'Internal Server Error' });
		}
		return { success: true };
	},

	update_car: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const rawCar = formData.get('car');

		if (typeof rawCar !== 'string') {
			return fail(400, { message: 'Invalid data' });
		}

		try {
			const car = JSON.parse(rawCar);

			if (!car.description) {
				return fail(400, { message: 'Missing car description' });
			}

			await db.update(table.car)
				.set({
					amount: car.estimatedAmount,
					actualAmount: car.actualAmount
				})
				.where(
					and(
						eq(table.car.userId, locals.user.id),
						eq(table.car.description, String(car.description))
					)
				);
		} catch (err) {
			console.error('Failed to update car', err);
			return fail(500, { message: 'Internal Server Error' });
		}
		return { success: true };
	},

	update_grocery: async (event) => {
		const formData = await event.request.formData();
		const rawGroceryItem = formData.get('groceryItem') as string;

		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			const groceryItem = JSON.parse(rawGroceryItem);
			const amount = parseFloat(groceryItem.amount);
			if (isNaN(amount)) {
				console.error('Invalid amount value:', groceryItem.amount);
				return fail(400, { message: 'Invalid amount value' });
			}

			await db
				.update(table.grocery)
				.set({ amount })
				.where(
					and(
						eq(table.grocery.userId, event.locals.user.id),
						eq(table.grocery.id, groceryItem.id)
					)
				);

		} catch (error) {
			console.error('Failed to update grocery item:', error);
			return fail(500, { message: 'Server error updating grocery' });
		}

		return { success: true };
	}
};

function generateId() {
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    const id = encodeBase32LowerCase(bytes);
    return id;
}