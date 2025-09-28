import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const TransactionsContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
};

export const TransactionsProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [categories, setCategories] = useState({
    income: ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"],
    expense: [
      "Alimentação",
      "Transporte",
      "Moradia",
      "Saúde",
      "Lazer",
      "Outros",
    ],
  });

  const getStorageKey = (key) => {
    return user ? `${key}_${user.uid}` : key;
  };

  // Carregar dados do AsyncStorage
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Limpar dados quando usuário faz logout
      setTransactions([]);
      setRecurringTransactions([]);
      setCategories({
        income: ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"],
        expense: [
          "Alimentação",
          "Transporte",
          "Moradia",
          "Saúde",
          "Lazer",
          "Outros",
        ],
      });
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [savedTransactions, savedCategories, savedRecurring] =
        await Promise.all([
          AsyncStorage.getItem(getStorageKey("transactions")),
          AsyncStorage.getItem(getStorageKey("categories")),
          AsyncStorage.getItem(getStorageKey("recurringTransactions")),
        ]);

      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }

      if (savedRecurring) {
        setRecurringTransactions(JSON.parse(savedRecurring));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  // Salvar transações no AsyncStorage
  const saveTransactions = async (newTransactions) => {
    try {
      await AsyncStorage.setItem(
        getStorageKey("transactions"),
        JSON.stringify(newTransactions)
      );
    } catch (error) {
      console.error("Erro ao salvar transações:", error);
    }
  };

  // Salvar categorias no AsyncStorage
  const saveCategories = async (newCategories) => {
    try {
      await AsyncStorage.setItem(
        getStorageKey("categories"),
        JSON.stringify(newCategories)
      );
    } catch (error) {
      console.error("Erro ao salvar categorias:", error);
    }
  };

  // Salvar transações recorrentes no AsyncStorage
  const saveRecurringTransactions = async (newRecurring) => {
    try {
      await AsyncStorage.setItem(
        getStorageKey("recurringTransactions"),
        JSON.stringify(newRecurring)
      );
    } catch (error) {
      console.error("Erro ao salvar transações recorrentes:", error);
    }
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString().split("T")[0],
      imageUrl: transaction.imageUrl || null, // Add imageUrl support
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const updateTransaction = (updatedTransaction) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === updatedTransaction.id
        ? {
            ...transaction,
            ...updatedTransaction,
            imageUrl: updatedTransaction.hasOwnProperty("imageUrl")
              ? updatedTransaction.imageUrl
              : transaction.imageUrl || null,
          }
        : transaction
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  // Funções para gerenciar categorias
  const addCategory = (type, categoryName) => {
    if (!categoryName.trim()) return;

    const newCategories = {
      ...categories,
      [type]: [...categories[type], categoryName.trim()],
    };
    setCategories(newCategories);
    saveCategories(newCategories);
  };

  const removeCategory = (type, categoryName) => {
    // Não permitir remover se há transações usando esta categoria
    const hasTransactions = transactions.some(
      (t) => t.category === categoryName
    );
    if (hasTransactions) {
      throw new Error("Não é possível excluir categoria que possui transações");
    }

    const newCategories = {
      ...categories,
      [type]: categories[type].filter((cat) => cat !== categoryName),
    };
    setCategories(newCategories);
    saveCategories(newCategories);
  };

  const updateCategory = (type, oldName, newName) => {
    if (!newName.trim()) return;

    // Atualizar transações que usam esta categoria
    const updatedTransactions = transactions.map((transaction) =>
      transaction.category === oldName
        ? { ...transaction, category: newName.trim() }
        : transaction
    );

    const newCategories = {
      ...categories,
      [type]: categories[type].map((cat) =>
        cat === oldName ? newName.trim() : cat
      ),
    };

    setCategories(newCategories);
    setTransactions(updatedTransactions);
    saveCategories(newCategories);
    saveTransactions(updatedTransactions);
  };

  // Funções para gerenciar transações recorrentes
  const addRecurringTransaction = (recurringTransaction) => {
    const newRecurring = {
      ...recurringTransaction,
      id: Date.now().toString(),
      nextDueDate:
        recurringTransaction.nextDueDate ||
        new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };
    const updatedRecurring = [newRecurring, ...recurringTransactions];
    setRecurringTransactions(updatedRecurring);
    saveRecurringTransactions(updatedRecurring);
  };

  const updateRecurringTransaction = (updatedRecurring) => {
    const updatedRecurringList = recurringTransactions.map((transaction) =>
      transaction.id === updatedRecurring.id ? updatedRecurring : transaction
    );
    setRecurringTransactions(updatedRecurringList);
    saveRecurringTransactions(updatedRecurringList);
  };

  const deleteRecurringTransaction = (id) => {
    const updatedRecurring = recurringTransactions.filter(
      (transaction) => transaction.id !== id
    );
    setRecurringTransactions(updatedRecurring);
    saveRecurringTransactions(updatedRecurring);
  };

  // Gerar transações baseadas nas recorrentes
  const generateRecurringTransactions = () => {
    const today = new Date();
    const newTransactions = [];

    recurringTransactions.forEach((recurring) => {
      const nextDue = new Date(recurring.nextDueDate);

      if (nextDue <= today) {
        // Criar transação baseada na recorrente
        const newTransaction = {
          id: `${recurring.id}-${Date.now()}`,
          title: recurring.title,
          description: recurring.description,
          amount: recurring.amount,
          category: recurring.category,
          type: recurring.type,
          date: recurring.nextDueDate,
          isRecurring: true,
          recurringId: recurring.id,
        };

        newTransactions.push(newTransaction);

        // Calcular próxima data
        const nextDate = new Date(nextDue);
        switch (recurring.frequency) {
          case "daily":
            nextDate.setDate(nextDate.getDate() + 1);
            break;
          case "weekly":
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case "monthly":
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case "yearly":
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        }

        // Atualizar próxima data da transação recorrente
        updateRecurringTransaction({
          ...recurring,
          nextDueDate: nextDate.toISOString().split("T")[0],
        });
      }
    });

    if (newTransactions.length > 0) {
      const updatedTransactions = [...newTransactions, ...transactions];
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
    }
  };

  // Executar verificação de transações recorrentes ao carregar o app
  useEffect(() => {
    if (recurringTransactions.length > 0) {
      generateRecurringTransactions();
    }
  }, []);

  const getTotalByType = (type) => {
    return transactions
      .filter((transaction) => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getBalance = () => {
    const income = getTotalByType("income");
    const expense = getTotalByType("expense");
    return income - expense;
  };

  const value = {
    transactions,
    recurringTransactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTotalByType,
    getBalance,
    addCategory,
    removeCategory,
    updateCategory,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    generateRecurringTransactions,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
