using UnityEngine;
using UnityEngine.AI;

public class EnemyAI : MonoBehaviour
{
    [Header("基础设置")]
    public float health = 100f;
    public float moveSpeed = 2f;
    public int damage = 10;
    public float attackRange = 2f;
    public float attackRate = 2f;

    [Header("敌人类型")]
    public bool isBoss = false;
    public float bossShieldDuration = 5f;
    public GameObject crystalPrefab;
    public int crystalsToDestroy = 3;

    [Header("攻击设置")]
    public GameObject projectilePrefab;
    public Transform firePoint;
    public float projectileSpeed = 10f;

    [Header("检测设置")]
    public float detectionRange = 10f;
    public LayerMask playerLayer;

    private Transform playerTransform;
    private NavMeshAgent navMeshAgent;
    private float nextAttackTime = 0f;
    private bool isAttacking = false;
    private bool isShielded = false;
    private float shieldTimer = 0f;
    private int remainingCrystals;
    private HealthSystem healthSystem;

    void Start()
    {
        playerTransform = GameObject.FindGameObjectWithTag("Player")?.transform;
        navMeshAgent = GetComponent<NavMeshAgent>();
        healthSystem = GetComponent<HealthSystem>();

        if (navMeshAgent)
        {
            navMeshAgent.speed = moveSpeed;
        }

        if (isBoss)
        {
            // 初始化BOSS护盾状态
            isShielded = true;
            remainingCrystals = crystalsToDestroy;
            SpawnCrystals();
        }

        if (healthSystem)
        {
            healthSystem.SetHealth(health);
        }
    }

    void Update()
    {
        if (!playerTransform)
            return;

        float distanceToPlayer = Vector3.Distance(transform.position, playerTransform.position);

        // 检测玩家
        if (distanceToPlayer <= detectionRange)
        {
            if (distanceToPlayer <= attackRange && Time.time >= nextAttackTime)
            {
                Attack();
            }
            else if (!isAttacking)
            {
                MoveToPlayer();
            }
        }
        else
        {
            // 巡逻行为可以在这里添加
        }

        // BOSS护盾逻辑
        if (isBoss && isShielded)
        {
            shieldTimer += Time.deltaTime;
            if (shieldTimer >= bossShieldDuration)
            {
                // 护盾持续时间结束，重置
                shieldTimer = 0f;
                isShielded = false;
            }
        }
    }

    void MoveToPlayer()
    {
        if (navMeshAgent && !navMeshAgent.pathPending)
        {
            navMeshAgent.SetDestination(playerTransform.position);
        }
    }

    void Attack()
    {
        isAttacking = true;
        nextAttackTime = Time.time + attackRate;

        // 面向玩家
        transform.LookAt(playerTransform);

        // 发射 projectile
        if (projectilePrefab && firePoint)
        {
            GameObject projectile = Instantiate(projectilePrefab, firePoint.position, firePoint.rotation);
            Rigidbody rb = projectile.GetComponent<Rigidbody>();

            if (rb)
            {
                rb.velocity = firePoint.forward * projectileSpeed;
            }

            Projectile projectileScript = projectile.GetComponent<Projectile>();
            if (projectileScript)
            {
                projectileScript.damage = damage;
                projectileScript.isEnemyProjectile = true;
            }
        }

        // 攻击动画可以在这里触发

        // 攻击结束后继续移动
        Invoke(nameof(ResetAttack), 0.5f);
    }

    void ResetAttack()
    {
        isAttacking = false;
    }

    public void TakeDamage(float damage)
    {
        // BOSS有护盾时免疫伤害
        if (isBoss && isShielded)
            return;

        if (healthSystem)
        {
            healthSystem.TakeDamage(damage);
            if (healthSystem.IsDead())
            {
                Die();
            }
        }
        else
        {
            health -= damage;
            if (health <= 0)
            {
                Die();
            }
        }
    }

    void Die()
    {
        // 死亡动画和特效可以在这里添加

        // 生成宝箱或掉落物品
        if (Random.value <= 0.3f) // 30%概率掉落宝箱
        {
            // 在这里生成宝箱预制体
        }

        Destroy(gameObject);
    }

    void SpawnCrystals()
    {
        // 在BOSS周围生成水晶
        for (int i = 0; i < crystalsToDestroy; i++)
        {
            float angle = i * (360f / crystalsToDestroy);
            Vector3 direction = Quaternion.Euler(0, angle, 0) * Vector3.forward;
            Vector3 spawnPosition = transform.position + direction * 5f;

            // 确保水晶生成在地面上
            RaycastHit hit;
            if (Physics.Raycast(spawnPosition + Vector3.up * 10f, Vector3.down, out hit, 20f))
            {
                spawnPosition = hit.point;
                Instantiate(crystalPrefab, spawnPosition, Quaternion.identity);
            }
        }
    }

    public void CrystalDestroyed()
    {
        remainingCrystals--;
        if (remainingCrystals <= 0)
        {
            isShielded = false;
            // 可以添加护盾失效的特效
        }
    }
}