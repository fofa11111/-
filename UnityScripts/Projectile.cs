using UnityEngine;

public class Projectile : MonoBehaviour
{
    public float damage = 20f;
    public float speed = 10f;
    public float lifetime = 3f;
    public bool isEnemyProjectile = false;
    public bool hasSlowEffect = false;
    public float slowDuration = 2f;
    public float slowAmount = 0.5f;

    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        if (rb)
        {
            rb.velocity = transform.forward * speed;
        }

        // 设置自动销毁
        Destroy(gameObject, lifetime);
    }

    void OnCollisionEnter(Collision collision)
    {
        // 检查碰撞对象
        if (isEnemyProjectile)
        {
            // 敌人子弹击中玩家
            if (collision.gameObject.CompareTag("Player"))
            {
                HealthSystem playerHealth = collision.gameObject.GetComponent<HealthSystem>();
                if (playerHealth)
                {
                    playerHealth.TakeDamage(damage);
                }
                Destroy(gameObject);
            }
            // 敌人子弹不与其他敌人碰撞
            else if (collision.gameObject.CompareTag("Enemy"))
            {
                Physics.IgnoreCollision(collision.collider, GetComponent<Collider>());
            }
            else
            {
                Destroy(gameObject);
            }
        }
        else
        {
            // 玩家子弹击中敌人
            if (collision.gameObject.CompareTag("Enemy"))
            {
                EnemyAI enemyAI = collision.gameObject.GetComponent<EnemyAI>();
                if (enemyAI)
                {
                    enemyAI.TakeDamage(damage);

                    // 应用减速效果
                    if (hasSlowEffect)
                    {
                        // 这里可以实现敌人减速逻辑
                    }
                }
                Destroy(gameObject);
            }
            // 玩家子弹不与玩家碰撞
            else if (collision.gameObject.CompareTag("Player"))
            {
                Physics.IgnoreCollision(collision.collider, GetComponent<Collider>());
            }
            // 玩家子弹击中场景中的水晶（BOSS关卡）
            else if (collision.gameObject.CompareTag("Crystal"))
            {
                Crystal crystal = collision.gameObject.GetComponent<Crystal>();
                if (crystal)
                {
                    crystal.TakeDamage(damage);
                }
                Destroy(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }
    }
}