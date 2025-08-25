using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("移动设置")]
    public float moveSpeed = 5f;
    public float jumpForce = 8f;
    public float gravity = 9.8f;

    [Header("跳跃设置")]
    public float doubleJumpForce = 6f;
    public ParticleSystem jumpParticle;

    [Header("视角设置")]
    public float mouseSensitivity = 100f;
    public Transform cameraTransform;

    private CharacterController characterController;
    private Vector3 moveDirection;
    private bool isJumping = false;
    private bool canDoubleJump = false;
    private float verticalRotation = 0f;

    // 武器系统引用
    public WeaponSystem weaponSystem;

    void Start()
    {
        characterController = GetComponent<CharacterController>();
        Cursor.lockState = CursorLockMode.Locked;
    }

    void Update()
    {
        HandleMovement();
        HandleJumping();
        HandleMouseLook();
        HandleShooting();
    }

    void HandleMovement()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");

        Vector3 forward = transform.TransformDirection(Vector3.forward);
        Vector3 right = transform.TransformDirection(Vector3.right);

        moveDirection.x = right.x * horizontalInput * moveSpeed;
        moveDirection.z = forward.z * verticalInput * moveSpeed;

        // 应用重力
        if (!characterController.isGrounded)
        {
            moveDirection.y -= gravity * Time.deltaTime;
        }
        else
        {
            moveDirection.y = -0.5f; // 保持一点向下的力，确保角色始终与地面接触
            isJumping = false;
            canDoubleJump = true;
        }

        characterController.Move(moveDirection * Time.deltaTime);
    }

    void HandleJumping()
    {
        if (characterController.isGrounded && Input.GetButtonDown("Jump"))
        {
            Jump(jumpForce);
        }
        else if (canDoubleJump && Input.GetButtonDown("Jump"))
        {
            Jump(doubleJumpForce);
            canDoubleJump = false;
            // 播放二段跳粒子效果
            if (jumpParticle)
            {
                jumpParticle.Play();
            }
        }
    }

    void Jump(float force)
    {
        moveDirection.y = force;
        isJumping = true;
    }

    void HandleMouseLook()
    {
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime;

        // 水平旋转
        transform.Rotate(Vector3.up * mouseX);

        // 垂直旋转
        verticalRotation -= mouseY;
        verticalRotation = Mathf.Clamp(verticalRotation, -90f, 90f);

        cameraTransform.localRotation = Quaternion.Euler(verticalRotation, 0f, 0f);
    }

    void HandleShooting()
    {
        if (Input.GetMouseButtonDown(0))
        {
            weaponSystem.Shoot();
        }
        else if (Input.GetMouseButton(0))
        {
            weaponSystem.Charge();
        }
        else if (Input.GetMouseButtonUp(0))
        {
            weaponSystem.ReleaseCharge();
        }
    }
}