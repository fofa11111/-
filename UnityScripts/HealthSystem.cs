using UnityEngine;
using UnityEngine.Events;

public class HealthSystem : MonoBehaviour
{
    [Header("健康设置")]
    public float maxHealth = 100f;
    public float currentHealth;
    public float invulnerabilityTime = 1f;

    [Header("UI设置")]
    public GameObject healthBarUI;
    public UnityEngine.UI.Image healthBarFill;

    [Header("事件")]
    public UnityEvent onDeath;
    public UnityEvent onDamage;

    private bool isInvulnerable = false;
    private float invulnerabilityTimer = 0f;
    private Renderer[] renderers;

    void Start()
    {
        currentHealth = maxHealth;
        renderers = GetComponentsInChildren<Renderer>();
        UpdateHealthBar();
    }

    void Update()
    {
        if (isInvulnerable)
        {
            invulnerabilityTimer += Time.deltaTime;
            if (invulnerabilityTimer >= invulnerabilityTime)
            {
                isInvulnerable = false;
                invulnerabilityTimer = 0f;
                SetRenderersVisible(true);
            }
            else
            {
                // 闪烁效果
                bool isVisible = Mathf.Floor(invulnerabilityTimer * 10) % 2 == 0;
                SetRenderersVisible(isVisible);
            }
        }
    }

    public void SetHealth(float health)
    {
        currentHealth = Mathf.Clamp(health, 0, maxHealth);
        UpdateHealthBar();
    }

    public void TakeDamage(float damage)
    {
        if (isInvulnerable)
            return;

        currentHealth -= damage;
        currentHealth = Mathf.Clamp(currentHealth, 0, maxHealth);

        UpdateHealthBar();
        onDamage.Invoke();

        if (currentHealth <= 0)
        {
            Die();
        }
        else
        {
            // 玩家受伤时触发无敌状态
            if (gameObject.CompareTag("Player"))
            {
                isInvulnerable = true;
                invulnerabilityTimer = 0f;
            }
        }
    }

    public void Heal(float amount)
    {
        currentHealth += amount;
        currentHealth = Mathf.Clamp(currentHealth, 0, maxHealth);
        UpdateHealthBar();
    }

    public bool IsDead()
    {
        return currentHealth <= 0;
    }

    void Die()
    {
        onDeath.Invoke();

        // 玩家死亡处理
        if (gameObject.CompareTag("Player"))
        {
            // 显示游戏结束UI或复活倒计时
            GameManager.instance.ShowRespawnUI();
        }
        else
        {
            // 敌人死亡处理
            // 可以在这里添加死亡动画和特效
        }
    }

    void UpdateHealthBar()
    {
        if (healthBarFill)
        {
            healthBarFill.fillAmount = currentHealth / maxHealth;
        }

        if (healthBarUI)
        {
            healthBarUI.SetActive(currentHealth < maxHealth);
        }
    }

    void SetRenderersVisible(bool visible)
    {
        foreach (Renderer renderer in renderers)
        {
            renderer.enabled = visible;
        }
    }
}