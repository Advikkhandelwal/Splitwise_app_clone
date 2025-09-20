import express from "express";
import { PrismaClient } from "@prisma/client";

// @prisma/client is an auto-generated and type-safe database client created for your schema.
//When you run: npx prisma generate
//The Prisma Client is an auto-generated database client (library) that Prisma builds for you, based on your schema.prisma

const app = express();
//new PrismaClient() creates an instance
//you are creating a connection manager to your database.
const prisma = new PrismaClient();

app.use(express.json());
// It tells Express (your web server framework) to use the built-in middleware express.json().
// This middleware automatically parses incoming request bodies that are in JSON format.
// After parsing, it attaches the result to req.body

app.post("/users", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "This is a required feild" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }
    //P2002 is a Prisma error code ,it means Unique constraint failed on the database.

    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "User Id must be a number" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/groups", async (req, res) => {
  try {
    const { name, description, created_by } = req.body;

    if (!name || !description || !created_by) {
      return res.status(400).json({ error: "This is a required feild" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: created_by },
    });
    if (!user) {
      return res.status(404).json({ error: "No such user found" });
    }
    const group = await prisma.group.create({
      data: {
        name,
        description,
        created_by,
      },
    });
    return res.status(201).json(group);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//Adds a user to an existing group.
app.post("/groups/:id/members", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group id" });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User id is required" });
    }

    const group = await prisma.group.findUnique({
      where: { group_id: groupId },
    });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const user = await prisma.user.findUnique({ where: { user_id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingMember = await prisma.groupMember.findFirst({
      where: { group_id: groupId, user_id },
    });
    if (existingMember) {
      return res.status(409).json({ error: "User already in this group" });
    }

    const member = await prisma.groupMember.create({
      data: { group_id: groupId, user_id },
    });

    return res.status(201).json(member);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const { group_id, paid_by, amount, description } = req.body;

    if (!group_id || !paid_by || !amount) {
      return res
        .status(400)
        .json({ error: "group_id, paid_by, and amount are required" });
    }

    const group = await prisma.group.findUnique({
      where: { group_id: group_id },
    });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: paid_by },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expense = await prisma.expense.create({
      data: {
        group_id,
        paid_by,
        amount,
        description,
      },
    });

    return res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/groups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid Group id" });
    }
    const group = await prisma.group.findUnique({
      where: { user_id: userId },
      include: {
        members: {
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });
    if (!group) {
      return res.status(404).json({ error: "Group Not Found" });
    }
    res.status(200).json({
      group_id: group.group_id,
      name: group.name,
      description: group.description,
      created_by: group.created_by,
      created_at: group.created_at,
      members: group.members.map((m) => m.user),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/groups/:id/balance", async (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return res.status(404).json({ error: "Group not found" });
    }

    const members = await prisma.GroupMember.findMany({
      where: { group_id: groupId },
      include: { user: true },
    });

    if (members.length === 0) {
      return res.status(404).json({ error: "No member found in this group" });
    }

    const balances = {};
    members.forEach((member) => {
      balances[member.user_id] = 0;
    });

    const expenses = await prisma.Expense.findMany({
      where: { group_id: groupId },
      include: { splits: true },
    });

    expenses.forEach((exp) => {
      if (exp.paid_by) {
        balances[exp.paid_by] += Number(exp.amount);
      }
      exp.splits.forEach((split) => {
        balances[split.user_id] -= Number(split.share);
      });
    });

    const settlements = await prisma.Settlement.findMany({
      where: { group_id: groupId },
    });

    settlements.forEach((settle) => {
      if (settle.paid_by) {
        balances[settle.paid_by] -= Number(settle.amount);
      }
      if (settle.paid_to) {
        balances[settle.paid_to] += Number(settle.amount);
      }
    });

    return res.status(200).json(balances);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expenseId = parseInt(id, 10);

    if (isNaN(expenseId)) {
      return res.status(400).json({ error: "Invalid expense id" });
    }

    const expense = await prisma.expense.findUnique({
      where: { expense_id: expenseId },
      include: {
        payer: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
        group: {
          select: {
            group_id: true,
            name: true,
            description: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    return res.status(200).json({
      expense_id: expense.expense_id,
      description: expense.description,
      amount: expense.amount,
      created_at: expense.created_at,
      group: expense.group,
      paid_by: expense.payer,
      splits: expense.splits.map((s) => ({
        user: s.user,
        share: s.share,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//

app.get("/groups/:id/expenses", async (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group id" });
    }

    const group = await prisma.group.findUnique({
      where: { group_id: groupId },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const expenses = await prisma.expense.findMany({
      where: { group_id: groupId },
      include: {
        payer: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(
      expenses.map((exp) => ({
        expense_id: exp.expense_id,
        description: exp.description,
        amount: exp.amount,
        created_at: exp.created_at,
        paid_by: exp.payer,
        splits: exp.splits.map((s) => ({
          user: s.user,
          share: s.share,
        })),
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/settlements", async (req, res) => {
  try {
    const { group_id, paid_by, paid_to, amount } = req.body;

    if (!group_id || !paid_by || !paid_to || !amount) {
      return res
        .status(400)
        .json({ error: "group_id, paid_by, paid_to, and amount are required" });
    }
    if (paid_by === paid_to) {
      return res
        .status(400)
        .json({ error: "Payer and receiver cannot be the same user" });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }

    const group = await prisma.group.findUnique({
      where: { group_id: group_id },
    });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const payer = await prisma.user.findUnique({
      where: { user_id: paid_by },
    });

    const receiver = await prisma.user.findUnique({
      where: { user_id: paid_to },
    });

    if (!payer || !receiver) {
      return res.status(404).json({ error: "Payer or receiver not found" });
    }
    const payerMember = await prisma.groupMember.findFirst({
      where: {
        group_id: group_id,
        user_id: paid_by,
      },
    });
    const receiverMember = await prisma.groupMember.findFirst({
      where: { group_id, user_id: paid_to },
    });
    if (!payerMember || !receiverMember) {
      return res
        .status(400)
        .json({ error: "Both users must be members of the group" });
    }

    const settlement = await prisma.settlement.create({
      data: {
        group_id,
        paid_by,
        paid_to,
        amount: Number(amount),
      },
    });

    return res.status(201).json(settlement);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users/:id/settlements", async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = parseInt(id, 10);

    if (isNaN(user_id)) {
      res.status(400).json({ error: "Invalid user id" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: user_id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const settlementsPaid = await prisma.settlement.findMany({
      where: { paid_by: user_id },
      include: {
        receiver: {
          select: {
            user_id: true,
            user_name: true,
          },
        },
        group: {
          select: {
            group_id: true,
            name: true,
          },
        },
      },
    });
    const settlementsReceived = await prisma.settlement.findMany({
      where: { paid_to: user_id },
      include: {
        payer: {
          select: {
            user_id: true,
            name: true,
          },
        },
        group: {
          select: {
            group_id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json({
      user: { user_id: user.user_id, name: user.name },
      settlementsPaid,
      settlementsReceived,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/groups/:id/settlements", async (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group id" });
    }
    const group = await prisma.group.findUnique({
      where: { group_id: groupId },
    });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const settlements = await prisma.settlement.findMany({
      where: { group_id: groupId },
      include: {
        payer: { select: { user_id: true, name: true } },
        receiver: { select: { user_id: true, name: true } },
      },
    });

    return res.status(200).json({
      group: { group_id: group.group_id, name: group.name },
      settlements,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});





