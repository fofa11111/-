using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    [Header("游戏状态")]
    public bool isGameActive = false;
    public int score = 0;
    public int wave = 1;
    public int enemiesPerWave = 5;
    public float waveInterval = 30f;

    [Header("UI元素")]
    public GameObject mainMenuUI;
    public GameObject gameHUD;
    public GameObject respawnUI;
    public GameObject gameOverUI;
    public Text scoreText;
    public Text waveText;
    public Text respawnCountdownText;

    [Header("生成设置")]
    public Transform[] spawnPoints;
    public GameObject[] enemyPrefabs;
    public float spawnInterval = 2f;

    [Header("玩家设置")]
    public GameObject playerPrefab;
    public Transform playerSpawnPoint;
    public float respawnTime = 3f;

    private int enemiesRemaining = 0;
    private float waveTimer = 0f;
    private bool isRespawning = false;

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        ShowMainMenu();
    }

    void Update()
    {
        if (!isGameActive)
            return;

        // 波浪计时器
        waveTimer += Time.deltaTime;

        // 检查是否所有敌人都被消灭
        if (enemiesRemaining <= 0 && waveTimer >= waveInterval)
        {
            StartNewWave();
        }

        // 更新UI
        UpdateHUD();
    }

    public void StartGame()
    {
        isGameActive = true;
        score = 0;
        wave = 1;

        // 隐藏主菜单，显示游戏HUD
        mainMenuUI.SetActive(false);
        gameHUD.SetActive(true);
        respawnUI.SetActive(false);
        gameOverUI.SetActive(false);

        // 生成玩家
        SpawnPlayer();

        // 开始第一波
        StartNewWave();
    }

    public void ShowMainMenu()
    {
        isGameActive = false;
        mainMenuUI.SetActive(true);
        gameHUD.SetActive(false);
        respawnUI.SetActive(false);
        gameOverUI.SetActive(false);
    }

    public void ShowRespawnUI()
    {
        if (!isRespawning)
        {
            isRespawning = true;
            respawnUI.SetActive(true);
            StartCoroutine(RespawnCountdown());
        }
    }

    public void GameOver()
    {
        isGameActive = false;
        gameOverUI.SetActive(true);
        gameHUD.SetActive(false);
        // 可以在这里保存分数或显示游戏结束信息
    }

    IEnumerator RespawnCountdown()
    {
        float countdown = respawnTime;
        while (countdown > 0)
        {
            respawnCountdownText.text = Mathf.Ceil(countdown).ToString();
            countdown -= Time.deltaTime;
            yield return null;
        }

        respawnUI.SetActive(false);
        SpawnPlayer();
        isRespawning = false;
    }

    void SpawnPlayer()
    {
        if (playerPrefab && playerSpawnPoint)
        {
            GameObject player = Instantiate(playerPrefab, playerSpawnPoint.position, playerSpawnPoint.rotation);
            // 可以在这里设置玩家属性或状态
        }
    }

    void StartNewWave()
    {
        waveTimer = 0f;
        wave++;
        enemiesPerWave = Mathf.RoundToInt(enemiesPerWave * 1.2f); // 每波敌人数量增加20%
        enemiesRemaining = enemiesPerWave;

        // 开始生成敌人
        StartCoroutine(SpawnEnemies());
    }

    IEnumerator SpawnEnemies()
    {
        int enemiesSpawned = 0;

        while (enemiesSpawned < enemiesPerWave)
        {
            if (spawnPoints.Length > 0 && enemyPrefabs.Length > 0)
            {
                // 随机选择生成点
                int spawnIndex = Random.Range(0, spawnPoints.Length);
                Transform spawnPoint = spawnPoints[spawnIndex];

                // 随机选择敌人类型（随波数增加，更强的敌人出现概率增加）
                int enemyIndex = 0;
                float randomValue = Random.value;
                float bossChance = Mathf.Clamp((wave - 1) * 0.05f, 0f, 0.2f); // 每波增加5%的BOSS概率，最高20%

                if (randomValue < bossChance && wave > 3)
                {
                    // 选择BOSS类型（如果有）
                    enemyIndex = enemyPrefabs.Length - 1;
                }
                else
                {
                    // 普通敌人
                    enemyIndex = Random.Range(0, enemyPrefabs.Length - (wave > 3 ? 1 : 0));
                }

                GameObject enemyPrefab = enemyPrefabs[enemyIndex];
                Instantiate(enemyPrefab, spawnPoint.position, spawnPoint.rotation);
                enemiesSpawned++;
            }

            yield return new WaitForSeconds(spawnInterval);
        }
    }

    public void EnemyKilled()
    {
        enemiesRemaining--;
        score += 10;

        // 每波敌人存活30秒掉落宝箱
        if (waveTimer >= 30f && Random.value <= 0.5f)
        {
            SpawnChest();
        }
    }

    void SpawnChest()
    {
        // 在这里生成宝箱预制体
        // 宝箱可以包含随机增益，如生命值恢复、速度提升等
    }

    void UpdateHUD()
    {
        if (scoreText)
            scoreText.text = "得分: " + score;

        if (waveText)
            waveText.text = "第 " + wave + " 波";
    }
}