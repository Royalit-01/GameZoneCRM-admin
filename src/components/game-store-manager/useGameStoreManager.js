import React, { useEffect, useState } from "react";

const useGameStoreManager = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    number: "",
    address: "",
    isCafeEnabled: true,
  });
  const [screens, setScreens] = useState([]);
  const [currentScreen, setCurrentScreen] = useState({
    screenName: "",
    games: [],
  });
  const [editIndex, setEditIndex] = useState(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Ensure hooks are declared before any return
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStoreInfoChange = (field, value) => {
    setStoreInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddGame = () => {
    setCurrentScreen((prev) => ({
      ...prev,
      games: [...prev.games, { gameName: "", pricing: {}, allowedPlayers: "" }],
    }));
  };

  const handleRemoveGame = (index) => {
    const newGames = [...currentScreen.games];
    newGames.splice(index, 1);
    setCurrentScreen({ ...currentScreen, games: newGames });
  };

  const handleScreenNameChange = (name) => {
    setCurrentScreen({ ...currentScreen, screenName: name });
  };

  const handleGameNameChange = (index, name) => {
    const newGames = [...currentScreen.games];
    newGames[index].gameName = name;
    setCurrentScreen({ ...currentScreen, games: newGames });
  };

  const handleAllowedPlayersChange = (index, value) => {
    const newGames = [...currentScreen.games];
    newGames[index].allowedPlayers = value;
    setCurrentScreen({ ...currentScreen, games: newGames });
  };

  const handlePriceChange = (gIdx, duration, p, value) => {
    const newGames = [...currentScreen.games];
    const game = newGames[gIdx];
    if (!game.pricing[duration]) game.pricing[duration] = {};
    game.pricing[duration][p] = value;
    setCurrentScreen({ ...currentScreen, games: newGames });
  };

  const saveOrUpdateScreen = () => {
    if (!currentScreen.screenName) {
      return alert("Please enter screen name.");
    }

    const normalizedNewName = currentScreen.screenName.trim().toLowerCase();

    const isDuplicate =
      editIndex === null && // only check for duplicates when adding a new screen
      screens.some(
        (screen) => screen.screenName.trim().toLowerCase() === normalizedNewName
      );

    if (isDuplicate) {
      return alert(
        "❌ Screen name already exists. Please use a different name."
      );
    }

    const updatedScreens = [...screens];

    if (editIndex !== null) {
      updatedScreens[editIndex] = currentScreen;
      setEditIndex(null);
    } else {
      updatedScreens.push({ ...currentScreen, highlight: true });

      // Remove highlight after a delay
      setTimeout(() => {
        setScreens((prev) =>
          prev.map((s, i) =>
            i === updatedScreens.length - 1 ? { ...s, highlight: false } : s
          )
        );
      }, 2000);
    }

    setScreens(updatedScreens);
    setCurrentScreen({ screenName: "", games: [] });
  };

  const handleEdit = (index) => {
    setCurrentScreen(screens[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (editIndex === index) {
      setCurrentScreen({ screenName: "", games: [] });
      setEditIndex(null);
    }
    const updated = [...screens];
    updated.splice(index, 1);
    setScreens(updated);
  };

  const handleSaveStore = async () => {
    const storeData = {
      ...storeInfo,
      screens,
    };

    // Validate
    if (!storeInfo.name || !storeInfo.number || !storeInfo.address) {
      return alert("Please fill all store info fields.");
    }

    if (
      !screens.length ||
      screens.some((s) => !s.screenName || !s.games.length)
    ) {
      return alert("Each screen must have a name and at least one game.");
    }

    try {
      const response = await fetch(
        "https://gamezonecrm.onrender.com/api/admin/save-store",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storeData),
        }
      );

      let result;
      try {
        result = await response.json();
      } catch (err) {
        console.error("Invalid JSON response from server");
        return alert("❌ Server error: invalid JSON response.");
      }

      if (response.ok) {
        alert("✅ Store data saved successfully!");
        // Reset store form and screen data
        setStoreInfo({ name: "", number: "", address: "" });
        setScreens([]);
        setCurrentScreen({ screenName: "", games: [] });
        setEditIndex(null);
      } else {
        alert("❌ Failed to save store data.");
        console.error(result?.error || "Unknown server error");
      }
    } catch (err) {
      console.error("Error saving store:", err);
      alert("❌ Network or server error while saving store.");
    }
  };

  return {
    storeInfo,
    handleRemoveGame,
    handleAddGame,
    setStoreInfo,
    screens,
    setScreens,
    currentScreen,
    setCurrentScreen,
    editIndex,
    setEditIndex,
    preview,
    setPreview,
    loading,
    setLoading,
    handleStoreInfoChange,
    handleSaveStore,
    handleDelete,
    handleEdit,
    saveOrUpdateScreen,
    handlePriceChange,
    handleAllowedPlayersChange,
    handleScreenNameChange,
    handleGameNameChange,
  };
};

export default useGameStoreManager;
