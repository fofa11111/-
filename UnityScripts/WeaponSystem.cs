using UnityEngine;

public class WeaponSystem : MonoBehaviour
{
    [Header("武器设置")]
    public GameObject magicProjectilePrefab;
    public GameObject bubbleProjectilePrefab;
    public Transform firePoint;
    public float fireRate = 0.5f;
    public float chargeTime = 1f;
    public float maxChargeDamageMultiplier = 3f;

    [Header("特效设置")]
    public ParticleSystem chargeParticle;
    public ParticleSystem fireParticle;

    [Header("音效设置")]
    public AudioSource shootSound;
    public AudioSource chargeSound;

    private float nextFireTime = 0f;
    private bool isCharging = false;
    private float currentChargeTime = 0f;
    private float chargeDamageMultiplier = 1f;
    private bool isBubbleGunUnlocked = false;

    void Update()
    {
        if (isCharging)
        {
            currentChargeTime += Time.deltaTime;
            chargeDamageMultiplier = Mathf.Lerp(1f, maxChargeDamageMultiplier, currentChargeTime / chargeTime);

            // 更新蓄力粒子效果
            if (chargeParticle && chargeParticle.isPlaying)
            {
                var main = chargeParticle.main;
                main.startSize = Mathf.Lerp(0.5f, 2f, currentChargeTime / chargeTime);
            }
        }
    }

    public void Shoot()
    {
        if (Time.time >= nextFireTime)
        {
            nextFireTime = Time.time + fireRate;
            FireProjectile(1f); // 普通射击没有伤害加成

            // 播放射击粒子和音效
            if (fireParticle)
                fireParticle.Play();
            if (shootSound)
                shootSound.Play();
        }
    }

    public void Charge()
    {
        if (!isCharging && Time.time >= nextFireTime)
        {
            isCharging = true;
            currentChargeTime = 0f;

            // 播放蓄力粒子和音效
            if (chargeParticle)
                chargeParticle.Play();
            if (chargeSound && !chargeSound.isPlaying)
                chargeSound.Play();
        }
    }

    public void ReleaseCharge()
    {
        if (isCharging)
        {
            isCharging = false;
            FireProjectile(chargeDamageMultiplier);

            // 停止蓄力粒子和音效
            if (chargeParticle)
                chargeParticle.Stop();
            if (chargeSound)
                chargeSound.Stop();

            nextFireTime = Time.time + fireRate;

            // 播放射击粒子和音效
            if (fireParticle)
                fireParticle.Play();
            if (shootSound)
                shootSound.Play();
        }
    }

    private void FireProjectile(float damageMultiplier)
    {
        GameObject projectilePrefab = isBubbleGunUnlocked ? bubbleProjectilePrefab : magicProjectilePrefab;

        if (projectilePrefab && firePoint)
        {
            GameObject projectile = Instantiate(projectilePrefab, firePoint.position, firePoint.rotation);
            Projectile projectileScript = projectile.GetComponent<Projectile>();

            if (projectileScript)
            {
                projectileScript.damage *= damageMultiplier;

                // 如果是泡泡枪，设置减速效果
                if (isBubbleGunUnlocked)
                {
                    projectileScript.hasSlowEffect = true;
                    projectileScript.slowDuration = 2f;
                    projectileScript.slowAmount = 0.5f;
                }
            }
        }
    }

    public void UnlockBubbleGun()
    {
        isBubbleGunUnlocked = true;
        // 可以在这里添加UI提示或特效
    }
}